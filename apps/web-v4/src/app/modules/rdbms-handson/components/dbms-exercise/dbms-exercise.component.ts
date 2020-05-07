/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { RdbmsHandsonService } from '../../services/rdbms-handson.service';
import { IRdbmsApiResponse, ISubmissionResult, IDbStructureResponse } from '../../model/rdbms-handson.model';
import { MatSnackBar, MatDialog } from '@angular/material';

import 'brace';
import 'brace/ext/language_tools';

import 'brace/mode/sql';
import 'brace/snippets/sql';
import { SubmissionDialogComponent } from '../submission-dialog/submission-dialog.component';
import { IProcessedViewerContent } from '../../../../services/viewer.service';

@Component({
  selector: 'app-dbms-exercise',
  templateUrl: './dbms-exercise.component.html',
  styleUrls: ['./dbms-exercise.component.scss']
})
export class DbmsExerciseComponent implements OnInit {
  @Input() resourceContent: IProcessedViewerContent;
  @ViewChild('dbRefreshSuccess', { static: true }) dbRefreshSuccess: ElementRef<any>;
  @ViewChild('dbRefreshFailed', { static: true }) dbRefreshFailed: ElementRef<any>;
  contentData: any;
  expectedOutput: IRdbmsApiResponse;
  executedResult: IRdbmsApiResponse;
  loading = false;
  initialLoading = false;
  dbStructure: IDbStructureResponse[] = [];
  verified = false;
  submitted = false;
  errorMessage = '';
  telltext = '';
  expectedOutputErrorMsg = '';
  submissionResult: ISubmissionResult;
  ignoreError = false;

  options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showPrintMargin: false,
    indentedSoftWrap: false,
    wrap: true
  };

  constructor(private formBuilder: FormBuilder,
    // tslint:disable-next-line:align
    private snackBar: MatSnackBar,
    // tslint:disable-next-line:align
    private dbmsSvc: RdbmsHandsonService,
    // tslint:disable-next-line:align
    public dialog: MatDialog) { }

  ngOnInit() {
    this.contentData = this.resourceContent.rdbms;
    this.initializeDb(false);
  }

  initializeDb(flag) {
    this.dbmsSvc.initializeDatabase(this.resourceContent.content.identifier).subscribe(
      response => {
        if (flag) {
          this.snackBar.open(this.dbRefreshSuccess.nativeElement.value);
        }
        this.dbmsSvc.fetchDBStructure(this.resourceContent.content.identifier).subscribe(
          result => {
            this.dbStructure = result.data ? JSON.parse(result.data) : [];
            this.initialLoading = true;
          });
        if (this.contentData.expectedOutput) {
          this.expectedOutputErrorMsg = '';
          this.loading = true;
          this.dbmsSvc.fetchExpectedOutput(this.resourceContent.content.identifier).subscribe(res => {
            this.expectedOutput = res;
            this.loading = false;
          },
            (err) => {
              this.expectedOutputErrorMsg = 'Some error occurred. Please try again later!';
              this.loading = false;
            });
        }
      }, (err) => {
        this.snackBar.open(this.dbRefreshFailed.nativeElement.value);
      });
  }

  verify() {
    this.executedResult = null;
    this.submissionResult = null;
    this.errorMessage = '';
    this.telltext = '';
    if (this.contentData.query) {
      const reqBody = {
        input_data: this.contentData.query,
        ignore_error: true
      };
      this.verified = true;
      this.dbmsSvc.verifyQuery(reqBody, this.resourceContent.content.identifier).subscribe(res => {
        this.executedResult = res;
        this.verified = false;
        this.telltext = res.tellTextMsg;
      },
        (err) => {
          this.errorMessage = 'Some error occurred. Please try again later!';
          this.verified = false;
        });
    }
  }

  submit() {
    this.executedResult = null;
    this.submissionResult = null;
    this.errorMessage = '';
    this.telltext = '';
    if (this.contentData.query) {
      const reqBody = {
        input_data: this.contentData.query,
        ignore_error: this.ignoreError
      };
      this.submitted = true;
      this.dbmsSvc.submitQuery(reqBody, this.resourceContent.content.identifier).subscribe(res => {
        this.executedResult = res.verifyResult;
        this.submitted = false;
        if (!this.executedResult.validationStatus && !this.ignoreError) {
          const dialogRef = this.dialog.open(SubmissionDialogComponent, {
            width: '500px'
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result) {
              this.ignoreError = true;
              this.submit();
            }
          });
        } else {
          this.submissionResult = { message: res.submissionMessage, status: res.submitionStatus };
          this.submitted = false;
          this.ignoreError = false;
        }
        this.telltext = res.tellTextMsg;
      }, (err) => {
        this.errorMessage = 'Some error occurred. Please try again later!';
        this.submitted = false;
      });
    }
  }
}
