/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable, timer, throwError, of, BehaviorSubject } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import {
  ICertificationCurrency,
  TCertificationView,
  ICertificationMeta,
  IBudgetApprovalRequest
} from '../../../../models/certification.model';
import { IContent } from '../../../../models/content.model';
import { FetchStatus, SendStatus } from '../../../../models/status.model';
import { IUserJLData } from '../../../../models/training.model';
import { GoBackDialogComponent } from '../go-back-dialog/go-back-dialog.component';
import { TrainingsService } from '../../../../services/trainings.service';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';
import { CertificationApiService } from '../../../../apis/certification-api.service';
import { CertificationService } from '../../../../services/certification.service';
import { CertificationTocSnackbarComponent } from '../certification-toc-snackbar/certification-toc-snackbar.component';

@Component({
  selector: 'ws-budget-approval',
  templateUrl: './budget-approval.component.html',
  styleUrls: ['./budget-approval.component.scss']
})
export class BudgetApprovalComponent implements OnInit {
  @Input() content: IContent;
  @Input() certification: ICertificationMeta;
  @Input() fetchSubject: BehaviorSubject<boolean>;
  @Output() changeView: EventEmitter<TCertificationView> = new EventEmitter();
  currencies: ICertificationCurrency[];
  userJLData: IUserJLData;

  currencyFetchStatus: FetchStatus = 'fetching';
  managerFetchStatus: FetchStatus;
  requestSendStatus: SendStatus;

  budgetForm: FormGroup = new FormGroup({
    currency: new FormControl('', Validators.required),
    amount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(99999999)]),
    approverEmail: new FormControl('', [Validators.required], [this._validateEmail.bind(this)])
  });

  constructor(
    private certificationSvc: CertificationService,
    private certificationApi: CertificationApiService,
    private trainingSvc: TrainingsService,
    private trainingApi: TrainingsApiService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this._getCurrencies();
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
    if (this.budgetForm.invalid) {
      this.snackbar.openFromComponent(CertificationTocSnackbarComponent, {
        data: {
          action: 'cert_budget_send',
          code: 'form_invalid'
        }
      });
      return;
    }

    const budgetRequest: IBudgetApprovalRequest = {
      amount: this.budgetForm.value.amount,
      currency: this.budgetForm.value.currency,
      manager_id: this.budgetForm.value.approverEmail.split('@')[0]
    };

    this.requestSendStatus = 'sending';
    this.certificationSvc.sendBudgetApprovalRequest(this.content.identifier, budgetRequest).subscribe(res => {
      this.snackbar.openFromComponent(CertificationTocSnackbarComponent, {
        data: {
          action: 'cert_budget_send',
          code: res.res_code
        }
      });

      if (res.res_code === 1) {
        this.requestSendStatus = 'done';
        this.fetchSubject.next(true);
        this.changeView.emit('default');
        return;
      }

      this.requestSendStatus = 'error';
    });
  }

  private _getCurrencies() {
    this.currencyFetchStatus = 'fetching';
    this.certificationApi.getCurrencies().subscribe(
      result => {
        this.currencies = result;
        this.currencyFetchStatus = 'done';
      },
      () => {
        this.currencies = [];
        this.currencyFetchStatus = 'error';
      }
    );
  }

  private _validateEmail(control: AbstractControl): Observable<ValidationErrors | null> {
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

  private _getUserManager() {
    this.managerFetchStatus = 'fetching';
    this.trainingSvc.getUserJLData().subscribe(
      result => {
        this.userJLData = result;
        this.budgetForm.patchValue({
          approverEmail: this.userJLData.manager
        });
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
}
