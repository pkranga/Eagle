/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable, timer, throwError, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import { GoBackDialogComponent } from '../go-back-dialog/go-back-dialog.component';
import { TCertificationView, ICertificationMeta } from '../../../../models/certification.model';
import { SendStatus, FetchStatus } from '../../../../models/status.model';
import { IContent } from '../../../../models/content.model';
import { CertificationTocSnackbarComponent } from '../certification-toc-snackbar/certification-toc-snackbar.component';
import { CertificationService } from '../../../../services/certification.service';
import { TrainingsService } from '../../../../services/trainings.service';
import { IUserJLData } from '../../../../models/training.model';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';
import { CERT_FILE_TYPES, MAX_FILE_SIZE_BYTES, CERT_GRADE_TYPES } from '../../constants/certification-constants';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'ws-result-upload',
  templateUrl: './result-upload.component.html',
  styleUrls: ['./result-upload.component.scss']
})
export class ResultUploadComponent implements OnInit {
  @Input() content: IContent;
  @Input() certification: ICertificationMeta;
  @Input() fetchSubject: BehaviorSubject<boolean>;
  @Output() changeView: EventEmitter<TCertificationView> = new EventEmitter();
  @ViewChild('fileInput', { static: true }) fileInput: ElementRef<HTMLInputElement>;

  resultForm: FormGroup;
  formData: FormData;
  userJLData: IUserJLData;
  managerFetchStatus: FetchStatus;
  requestSendStatus: SendStatus;
  proofDeleteStatus: SendStatus;
  proofSubmitStatus: SendStatus;
  currentDate: Date;
  farthestDate: Date;
  supportedFileTypes: string[];
  grades: string[];
  maxFileSize: number;

  constructor(
    private configSvc: ConfigService,
    private certificationSvc: CertificationService,
    private trainingSvc: TrainingsService,
    private trainingApi: TrainingsApiService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {
    this.formData = new FormData();
    this.currentDate = new Date();
    this.farthestDate = new Date();
    this.farthestDate.setFullYear(this.currentDate.getFullYear() - 3);
    this.supportedFileTypes = CERT_FILE_TYPES;
    this.grades = CERT_GRADE_TYPES;
    this.maxFileSize = MAX_FILE_SIZE_BYTES;
  }

  ngOnInit() {
    this.resultForm = new FormGroup({
      resultType: new FormControl(this.certification.verification_request.result_type, [Validators.required]),
      result: new FormControl(this.certification.verification_request.result, [Validators.required]),
      examDate: new FormControl(
        this.certification.verification_request.exam_date
          ? new Date(this.certification.verification_request.exam_date)
          : '',
        [Validators.required]
      ),
      verifierEmail: new FormControl(this.certification.verification_request.verifierEmail, [Validators.required]),
      file: new FormControl('', [this._validateFileType.bind(this), this._validateFileSize.bind(this)]),
      fileName: new FormControl(
        this.certification.verification_request.document
          ? this.certification.verification_request.document[0].document_name
          : ''
      )
    });

    if (!(this.content.verifiers && this.content.verifiers.length)) {
      this.resultForm.controls.verifierEmail.setAsyncValidators(this._validateVerifierEmail.bind(this));
    }

    if (!this.certification.verification_request.status) {
      this.resultForm.controls.file.setValidators(Validators.required);
    }

    this._getUserManager();
  }

  openGoBackDialog() {
    this.dialog
      .open<GoBackDialogComponent>(GoBackDialogComponent)
      .afterClosed()
      .subscribe((shouldClose: string) => {
        if (shouldClose === 'true') {
          this.changeView.emit('default');
        }
      });
  }

  onSubmit() {
    if (this.resultForm.invalid) {
      this.snackbar.openFromComponent(CertificationTocSnackbarComponent, {
        data: {
          action: 'cert_result_upload',
          code: 'form_invalid'
        }
      });
      return;
    }

    this.requestSendStatus = 'sending';
    this.certificationSvc.sendExternalProof(this.content.identifier, this.resultForm).subscribe(
      res => {
        this.requestSendStatus = 'done';

        this.snackbar.openFromComponent(CertificationTocSnackbarComponent, {
          data: {
            action: 'cert_result_upload',
            code: res.res_code
          }
        });

        if (res.res_code === 1) {
          this.fetchSubject.next(true);
          this.changeView.emit('default');
          return;
        }
      },
      () => {
        this.requestSendStatus = 'error';

        this.snackbar.openFromComponent(CertificationTocSnackbarComponent, {
          data: {
            action: 'cert_result_upload',
            code: 'error'
          }
        });
      }
    );
  }

  deleteProof() {
    this.proofDeleteStatus = 'sending';

    this.certificationSvc
      .deleteExternalProof(this.content.identifier, this.certification.verification_request.document[0].document_url)
      .subscribe(
        () => {
          this.proofDeleteStatus = 'done';
          this.fetchSubject.next(true);
          this.changeView.emit('default');
        },
        () => {
          this.proofDeleteStatus = 'error';
        }
      );
  }

  submitProof() {
    this.proofSubmitStatus = 'sending';

    this.certificationSvc.submitVerificationRequest(this.content.identifier, this.resultForm).subscribe(
      () => {
        this.proofSubmitStatus = 'done';
        this.fetchSubject.next(true);
        this.changeView.emit('default');
      },
      () => {
        this.proofSubmitStatus = 'error';
      }
    );
  }

  private _getUserManager() {
    this.managerFetchStatus = 'fetching';
    this.trainingSvc.getUserJLData().subscribe(
      result => {
        this.userJLData = result;
        if (!this.resultForm.value.verifierEmail) {
          this.resultForm.patchValue({
            verifierEmail: this.userJLData.manager
          });
        }
        this.managerFetchStatus = 'done';
      },
      () => {
        this.userJLData = {
          isJL6AndAbove: false,
          isJL7AndAbove: false,
          manager: ''
        };
        this.managerFetchStatus = 'error';
      }
    );
  }

  private _getFileType(fileName: string) {
    return fileName.substring(fileName.lastIndexOf('.', fileName.length)).toLowerCase();
  }

  private _validateVerifierEmail(control: AbstractControl): Observable<ValidationErrors> {
    return timer(500).pipe(
      map(() => control.value),
      switchMap((value: string) => {
        if (!value) {
          return throwError({ invalidEmail: true });
        }

        const trimmedEmail = value.split('@')[0];

        if (this.userJLData && trimmedEmail.toLowerCase() === this.userJLData.manager.toLowerCase()) {
          return of(null);
        }

        return this.trainingApi.getUserJL6Status(trimmedEmail);
      }),
      map(result => (result === null ? null : result.isJL7AndAbove ? null : { invalidEmail: true })),
      catchError(() => of({ invalidEmail: true }))
    );
  }

  private _validateScore(control: AbstractControl): ValidationErrors {
    const resultType: 'score' | 'grade' | 'percentage' | 'other' = this.resultForm.value.resultType;

    if (!resultType) {
      return { noResultType: true };
    }

    switch (resultType) {
      case 'score':
        if (!parseInt(control.value)) {
          return { scoreNaN: true };
        }
        break;

      case 'grade':
    }
  }

  private _validateFileSize(control: AbstractControl): ValidationErrors {
    const file: File = control.value;

    if (file) {
      const fileSize = file.size;

      if (fileSize > this.maxFileSize) {
        return {
          fileSizeExceeded: true
        };
      }
    }
    return null;
  }

  private _validateFileType(control: AbstractControl): ValidationErrors {
    const file: File = control.value;
    // const fileTypes: string[] = this.configSvc.instanceConfig.features.certificationsLHub.config.external
    //   .supportedFileFormats;

    if (file) {
      const fileType = this._getFileType(file.name);
      if (this.supportedFileTypes.some(supportedType => supportedType === fileType)) {
        return null;
      }

      return {
        fileTypeInvalid: true
      };
    }

    return null;
  }

  showForm() {
    console.log(this.resultForm);
  }
}
