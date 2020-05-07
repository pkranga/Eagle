/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IContent } from '../../../../models/content.model';
import { IUserApiResponse, IUserExerciseSubmitRequest, IUserFetchMySubmissionsResponse } from '../../../../models/exercise-submission.model';
import { ResolveResponse } from '../../../../models/routeResolver.model';
import { AuthService } from '../../../../services/auth.service';
import { ConfigService } from '../../../../services/config.service';
import { ExerciseService } from '../../../../services/exercise-submission.service';
import { RoutingService } from '../../../../services/routing.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { ValuesService } from '../../../../services/values.service';
import { ViewContentDialogComponent } from '../view-content-dialog/view-content-dialog.component';

type TFeedbackType = 'input' | 'video/mp4' | 'application/pdf';

@Component({
  selector: 'app-submission',
  templateUrl: './submission.component.html',
  styleUrls: ['./submission.component.scss']
})
export class SubmissionComponent implements OnInit {

  @ViewChild('tabGroup', { static: false }) tabGroup;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('errorOccured', { static: true }) errorOccuredToast: ElementRef;
  @ViewChild('exerciseSubmitSuccessful', { static: true }) exerciseSubmitSuccessfulToast: ElementRef;
  exerciseResponse: ResolveResponse<IContent>;
  supportedFormats: string[];
  showFeatures = true;
  fileSizeUnit: string;
  maxFileSize: number;
  paramSubscription: Subscription;
  contentId: string;
  content: IContent;
  errorMsg: any;
  manifest: any;
  submissionType: string;
  displayedColumns: string[] = ['currentRowNumber', 'submission_time', 'submission', 'feedback_by'];
  dataSource: MatTableDataSource<IUserFetchMySubmissionsResponse>;
  options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  };
  userSubmission: IUserFetchMySubmissionsResponse[] = undefined;
  currentTabIndex = 0;
  answer: string;
  submittingData = false;
  fetchingData = false;
  selectedFile: any;
  isEducator = false;
  isAllowedText = true;
  showEducatorButton = false;
  showSubmissionIcon: boolean;
  pipe: DatePipe;
  errorMessageCode: 'API_FAILURE' | 'NO_DATA' | 'INVALID_CONTENT_ID';
  fileUploadUrl: string;
  supportedFormatsHash = {
    'video/mp4': '.mp4',
    'application/pdf': '.pdf',
    'input': '.txt'
  };

  constructor(
    private snackBar: MatSnackBar,
    public routingSvc: RoutingService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private valuesSvc: ValuesService,
    private dialog: MatDialog,
    private exerciseService: ExerciseService,
    authSvc: AuthService,
    private telemetrySvc: TelemetryService,
    private configSvc: ConfigService
  ) {
    this.fileSizeUnit = this.configSvc.instanceConfig.platform.exerciseSubmission.fileSizeUnit;
    this.maxFileSize = this.configSvc.instanceConfig.platform.exerciseSubmission.maxFileSize;

  }

  ngOnInit() {
    this.valuesSvc.isXSmall$.subscribe(value => {
      this.showSubmissionIcon = value;
    });
    this.supportedFormats = [];

    this.paramSubscription = this.route.paramMap.subscribe(params => {
      this.contentId = params.get('contentId');
      this.exerciseResponse = this.route.snapshot.data['tocContent'];
      if (!this.exerciseResponse.error) {
        this.content = this.exerciseResponse.content;
        this.manifest = this.exerciseResponse.data;
        this.errorMessageCode = undefined;
      } else if (this.exerciseResponse.error === 'invalid_content_id') {
        this.errorMessageCode = 'INVALID_CONTENT_ID';
      } else {
        this.content = this.exerciseResponse.content;
      }
    });

    if (this.content) {
      this.getMySubmissions();
      if (this.manifest) {
        this.supportedFormats = this.manifest.acceptExtension;
        if (this.manifest.acceptText) {
          this.isAllowedText = this.manifest.acceptText;
        }
        this.maxFileSize =
          this.manifest.maxFileSize > this.configSvc.instanceConfig.platform.exerciseSubmission.maxFileSize ||
            this.manifest.maxFileSize === 0
            ? this.configSvc.instanceConfig.platform.exerciseSubmission.maxFileSize
            : this.manifest.maxFileSize;
      }
    }
  }

  getMySubmissions() {
    this.fetchingData = true;
    this.exerciseService.fetchMySubmissions(this.contentId).subscribe(
      data => {
        if (data.length) {
          this.userSubmission = data;
          this.errorMessageCode = undefined;
          for (let i = 0; i < this.userSubmission.length; i++) {
            this.userSubmission[i].currentRowNumber = i + 1;
          }
          this.dataSource = new MatTableDataSource<IUserFetchMySubmissionsResponse>(this.userSubmission);
          if (this.dataSource) {
            this.dataSource.filterPredicate = (content, filter) => {
              return this.filterDate(content, filter) || this.filterFeedback(content, filter);
            };
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else {
          this.errorMessageCode = 'NO_DATA';
        }

        this.fetchingData = false;
      },
      err => {
        this.errorMessageCode = 'API_FAILURE';
        this.fetchingData = false;
      }
    );
  }

  viewContent(type, url, submissionDate) {
    const dialogRef = this.dialog.open(ViewContentDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: {
        type,
        url,
        submissionDate,
        emailId: this.auth.userEmail,
        name: this.content.name
      }
    });
  }

  sendTelemetry(type: string, element) {
    this.telemetrySvc.viewExerciseFeedbackorSubmissionEvent(type,
      element.submission_id,
      new Date(element.submission_time).getTime(),
      type === 'viewFeedback' ? element.feedback_id : null,
      type === 'viewFeedback' ? element.feedback_by : null
    );
  }

  filterDate(content, filter) {
    this.pipe = new DatePipe('en');
    if (content.submission_time) {
      const formatted = this.pipe.transform(content.submission_time, 'dd MMM, yyyy');
      return formatted.toLocaleLowerCase().indexOf(filter) >= 0;
    } else {
      return false;
    }

  }

  filterFeedback(content, filter) {
    if (content.feedback_by) {
      return content.feedback_by.toLocaleLowerCase().indexOf(filter) >= 0;
    } else {
      return 'na'.indexOf(filter) >= 0;
    }
  }

  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openChooseFiles() {
    document.getElementById('selectedAnswerFile').click();
  }

  changeFile(event) {
    if (this.selectedFile) {
      this.selectedFile = null;
    }
    this.selectedFile = event.srcElement.files;
  }

  validateFile() {
    return this.validateFileFormat() && this.validateFileSize();
  }

  validateFileSize() {
    const isValid =
      this.selectedFile &&
      this.selectedFile.length &&
      this.selectedFile[0].size < this.maxFileSize;
    this.errorMsg = !isValid
      ? 'Max allowed file size: ' +
      this.maxFileSize / (1024 * 1024) +
      ' ' +
      this.fileSizeUnit
      : '';
    return isValid;
  }

  validateFileFormat() {
    const isValid =
      this.selectedFile &&
      this.selectedFile.length &&
      this.supportedFormats.indexOf(this.selectedFile[0].type) >= 0;
    this.errorMsg = !isValid
      ? 'Supported formats : ' + this.supportedFormats.join(', ')
      : '';
    return isValid;
  }

  reset() {
    if (this.tabGroup.selectedIndex === 0) {
      this.answer = '';
    } else if (this.tabGroup.selectedIndex === 1) {
      this.selectedFile = null;
    }
  }

  createContentDirectory(file, type, numOfChars = 0) {
    this.exerciseService.createContentDirectory(this.contentId).subscribe(
      data => {
        if (data.code === 201) {
          this.fileUploadToContentDirectory(file, type, numOfChars);
        }
      }, err => {
        if (err.status === 409) {
          this.fileUploadToContentDirectory(file, type, numOfChars);
        } else {
          this.submittingData = false;
          this.snackBar.open(this.errorOccuredToast.nativeElement.value);
        }
      }
    );
  }

  fileUploadToContentDirectory(file, type, numOfChars) {
    const date = new Date();
    const fileName = 'Submission_'
      + date.getFullYear()
      + '_' + String(Number(date.getMonth()) + 1)
      + '_' + date.getDate()
      + '_' + date.getHours()
      + '_' + date.getMinutes()
      + '_' + date.getMilliseconds()
      + this.supportedFormatsHash[file.type ? file.type : 'input'];
    const formData = new FormData();
    formData.append('file', file, fileName);
    this.exerciseService.fileUploadToContentDirectory(formData, this.contentId)
      .subscribe(data => {
        this.fileUploadUrl = data.contentUrl;
        if (this.fileUploadUrl) {
          this.saveSubmission(file, type, numOfChars);
        }
      }, err => {
        console.log('submission error', err);
        this.submittingData = false;
        this.snackBar.open(this.errorOccuredToast.nativeElement.value);
      });
  }

  saveSubmission(file, type, numOfChars) {
    const request: IUserExerciseSubmitRequest = {
      'submission_type': file.type ? file.type : 'input',
      'url': this.fileUploadUrl
    };
    this.exerciseService
      .exerciseSubmitFile(request, this.contentId)
      .subscribe(
        (data: IUserApiResponse) => {
          this.submittingData = false;
          this.selectedFile = null;
          this.answer = null;
          this.snackBar.open(this.exerciseSubmitSuccessfulToast.nativeElement.value);
          if (type === 'TEXT') {
            this.telemetrySvc.submitExerciseTelemetryEvent(type, numOfChars, '', '');
          } else if (type === 'FILE') {
            this.telemetrySvc.submitExerciseTelemetryEvent(type, 0, file.type, file.size)
          }
          this.getMySubmissions();
        },
        err => {
          console.log('in here in errr', err);
          this.submittingData = false;
          this.snackBar.open(this.errorOccuredToast.nativeElement.value);
        }
      );
  }


  submitForm() {
    this.submittingData = true;
    if (this.selectedFile && this.selectedFile.length && this.tabGroup && this.tabGroup.selectedIndex === 1) {
      this.createContentDirectory(this.selectedFile[0], 'FILE');
    } else if (this.answer && this.answer.length && this.tabGroup && this.tabGroup.selectedIndex === 0) {
      const file = new File([this.answer], 'submission.txt');
      this.createContentDirectory(file, 'TEXT', this.answer.length);
    }
  }


  checkIfDisabled() {
    if (this.isAllowedText && this.tabGroup && this.tabGroup.selectedIndex === 0) {
      return !this.answer;
    } else if (this.supportedFormats && this.supportedFormats.length > 0 && this.tabGroup && this.tabGroup.selectedIndex === 1) {
      return !this.validateFile();
    } else {
      return true;
    }
  }
}
