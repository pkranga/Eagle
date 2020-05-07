/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { map } from 'rxjs/operators';
import { IExerciseResponse, EXECUTION_STATUS } from '../../model/handsOn.model';
import { HandsOnService } from '../../services/hands-on.service';

import 'brace';
import 'brace/ext/language_tools';
import 'brace/mode/javascript';
import 'brace/snippets/javascript';

import 'brace/mode/python';
import 'brace/snippets/python';

import 'brace/mode/scala';
import 'brace/snippets/scala';

import 'brace/mode/golang';
import 'brace/snippets/golang';

import 'brace/mode/perl';
import 'brace/snippets/perl';

import 'brace/mode/ruby';
import 'brace/snippets/ruby';

import 'brace/mode/c_cpp';
import 'brace/snippets/c_cpp';

import 'brace/mode/clojure';
import 'brace/snippets/clojure';

import 'brace/mode/coffee';
import 'brace/snippets/coffee';

import 'brace/mode/java';
import 'brace/snippets/java';

import 'brace/mode/csharp';
import 'brace/snippets/csharp';

import 'brace/mode/r';
import 'brace/snippets/r';

import 'brace/mode/sh';
import 'brace/snippets/sh';

import 'brace/mode/typescript';
import 'brace/snippets/typescript';

import 'brace/mode/php';
import 'brace/snippets/php';

import 'brace/theme/eclipse';

import { MatDialog } from '@angular/material';
import { ExecutionResultComponent } from '../execution-result/execution-result.component';
import { UserService } from '../../../../services/user.service';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { ConfigService } from '../../../../services/config.service';
@Component({
  selector: 'app-exercise-container',
  templateUrl: './exercise-container.component.html',
  styleUrls: ['./exercise-container.component.scss']
})
export class ExerciseContainerComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  processedContent: any;
  apiErrorOccurred = false;
  executed: boolean;
  executionInProgress: boolean;
  EXECUTION_STATUS: any;
  exerciseData: IExerciseResponse;
  exerciseResult: any;
  exerciseStartedAt: number;
  exerciseTimeRemaining: number;
  hasFiredRealTimeProgress = false;
  isError: boolean;
  isPostActionSectionShown = false;
  options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
  };
  postActionSectionContent: 'execute' | 'verify' | 'submit' | 'submitNoVerify';
  private notifierTimerSubscription: Subscription;
  private timerSubscription: Subscription;
  realTimeProgressRequest: IUserRealTimeProgressUpdateRequest = {
    content_type: 'Resource',
    current: ['0'],
    max_size: 0,
    mime_type: MIME_TYPE.handson,
    user_id_type: 'uuid'
  };
  realTimeProgressTimer: any;
  submitData: any;
  submitResult: any;
  verifyData: any;
  verifyResult: any;
  constructor(
    private sanitizer: DomSanitizer,
    private configSvc: ConfigService,
    private handsOnSvc: HandsOnService,
    private userSvc: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.EXECUTION_STATUS = EXECUTION_STATUS;
  }

  ngOnChanges() {
    this.ngOnDestroy();
    this.initializeExercise();
    this.notifier('init');
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.notifierTimerSubscription) {
      this.notifierTimerSubscription.unsubscribe();
    }
    if (!this.hasFiredRealTimeProgress && this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this._fireRealTimeProgress();
      if (this.realTimeProgressTimer) {
        clearTimeout(this.realTimeProgressTimer);
      }
    }
  }

  private initializeExercise() {
    this.exerciseData = JSON.parse(JSON.stringify(this.processedContent.handsOn));
    this.exerciseData.safeProblemStatement = this.sanitize(this.exerciseData.problemStatement);
    this.exerciseData.timeLimit *= 1000;
    this.exerciseStartedAt = Date.now();
    this.exerciseTimeRemaining = this.exerciseData.timeLimit;
    this.executed = false;
    this.notifier('LOADED');
    if (this.exerciseData.timeLimit > -1) {
      this.timerSubscription = interval(100)
        .pipe(map(() => this.exerciseStartedAt + this.exerciseData.timeLimit - Date.now()))
        .subscribe(exerciseTimeRemaining => {
          this.exerciseTimeRemaining = exerciseTimeRemaining;
          if (this.exerciseTimeRemaining < 0) {
            this.exerciseTimeRemaining = 0;
            this.timerSubscription.unsubscribe();
          }
        });
    }
    this.notifierTimerSubscription = interval(30 * 1000).subscribe(() => {
      this.notifier('RUNNING');
    });
    if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this.raiseRealTimeProgress();
    }
  }

  reset() {
    this.initializeExercise();
    this.exerciseResult = null;
    this.verifyResult = null;
  }

  openExecutionDialog(type) {
    this.notifier('SUBMIT');
    this.executed = true;
    const dialogRef = this.dialog.open(ExecutionResultComponent, {
      width: '500px',
      data: type
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'submit') {
        this.submit(true);
      }
    });
  }

  showPostActionSection(option: 'execute' | 'verify' | 'submit') {
    this.postActionSectionContent = option;
    this.isPostActionSectionShown = true;
    if (option === 'execute') {
      this.execute();
    } else if (option === 'verify') {
      this.verify();
    } else if (option === 'submit') {
      this.submit();
    }
  }

  done() {
    this.notifier('DONE');
  }

  private sanitize(htmlString: string) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  private notifier(type: any) {
    const exerciseEvent: any = {
      type,
      plugin: 'handson',
      data: {}
    };
    switch (type) {
      case 'LOADED':
      case 'RUNNING':
        exerciseEvent.data.isSubmitted = this.executed;
        break;
      case 'SUBMIT':
        exerciseEvent.data = this.exerciseData;
        break;
      case 'DONE':
        break;
      default:
    }
    // this.parentComm.raiseTelemetryEvent(type, exerciseEvent);
  }

  execute() {
    this.executionInProgress = true;
    this.exerciseResult = null;
    const exerciseData = {
      language: this.exerciseData.supportedLanguages[0].id,
      code: this.exerciseData.starterCodes[0],
      stdin: ''
    };
    this.handsOnSvc.execute(exerciseData).subscribe(data => {
      this.executionInProgress = false;
      if (data) {
        this.exerciseResult = { ...data };
        this.exerciseResult.showOutput = '';
        if (this.exerciseResult.output !== '' && this.exerciseResult.errors === '') {
          this.exerciseResult.status = EXECUTION_STATUS.OK;
          this.exerciseResult.showOutput = this.exerciseResult.output;
        } else if (this.exerciseResult.errors !== '') {
          if (this.exerciseResult.output.toLowerCase().indexOf('compilation failed') > -1) {
            this.exerciseResult.status = EXECUTION_STATUS.ERROR;
            this.exerciseResult.showOutput = 'Compilation failed' + '\n' + this.exerciseResult.errors;
          } else if (this.exerciseResult.output.toLowerCase().indexOf('compilation succeeded') > -1) {
            this.exerciseResult.status = EXECUTION_STATUS.WARNING;
            this.exerciseResult.showOutput =
              this.exerciseResult.output + '\nWarnings:' + '\n' + this.exerciseResult.errors;
          } else {
            this.exerciseResult.status = EXECUTION_STATUS.ERROR;
            this.exerciseResult.showOutput =
              this.exerciseResult.output + '\nRuntime Exception' + '\n' + this.exerciseResult.errors;
          }
        }
      }
    });
  }

  verify() {
    this.executionInProgress = true;
    setTimeout(() => {
      const ResultElement = document.getElementById('verifyCard');
      if (ResultElement) {
        ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
    this.exerciseResult = null;
    this.verifyResult = null;
    this.submitResult = null;
    this.verifyResult = null;
    this.apiErrorOccurred = false;
    if (this.processedContent.handsOn.forFPCourse) {
      const lexId = this.processedContent.content.identifier;
      const exerciseDataFP = {
        user_solution: this.exerciseData.starterCodes[0],
        user_id_type: 'uuid',
        ignore_error: true
      };
      this.handsOnSvc.verifyFp(lexId, exerciseDataFP).subscribe(
        data => {
          if (data) {
            this.verifyData = { ...data };
            this.verifyResult = JSON.parse(this.verifyData.verifyResult);
            this.verifyResult.structural = this.verifyResult.TestResultData.filter(obj => obj.Type === 'Structural');
            this.verifyResult.sample = this.verifyResult.TestResultData.filter(obj => obj.SAType === 'Sample');
            this.verifyResult.actual = this.verifyResult.TestResultData.filter(obj => obj.SAType === 'Actual');
          }
          this.executionInProgress = false;
          const ResultElement = document.getElementById('verifyCard');
          if (ResultElement) {
            setTimeout(() => {
              ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        },
        error => {
          this.verifyResult = null;
          this.apiErrorOccurred = true;
          this.executionInProgress = false;
          const ResultElement = document.getElementById('verifyCard');
          if (ResultElement) {
            setTimeout(() => {
              ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        }
      );
    } else {
      const lexId = this.processedContent.content.identifier;
      const exerciseDataCE = {
        language_code: this.exerciseData.supportedLanguages[0].id,
        user_solution: this.exerciseData.starterCodes[0],
        user_id_type: 'uuid',
        ignore_error: true
      };
      this.handsOnSvc.verifyCe(lexId, exerciseDataCE).subscribe(
        data => {
          if (data) {
            this.verifyData = { ...data };
            this.verifyResult = JSON.parse(this.verifyData.verifyResult);
            this.verifyResult.Hiddens = this.verifyResult.testCaseOutputs.filter(obj => obj.type === 'hidden');
            this.verifyResult.Samples = this.verifyResult.testCaseOutputs.filter(obj => obj.type === 'sample');
            this.verifyResult.SamplesPassed = this.verifyResult.Samples.filter(obj => obj.result === 'Passed');
            this.verifyResult.HiddensPassed = this.verifyResult.Hiddens.filter(obj => obj.result === 'Passed');
            this.verifyResult.HiddensFailed = this.verifyResult.Hiddens.filter(obj => obj.result === 'Failed');
          }
          this.executionInProgress = false;
          const ResultElement = document.getElementById('verifyCard');
          if (ResultElement) {
            setTimeout(() => {
              ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        },
        error => {
          const ApiError = { ...error };
          this.verifyResult = null;
          this.apiErrorOccurred = true;
          this.executionInProgress = false;
          const ResultElement = document.getElementById('verifyCard');
          if (ResultElement) {
            setTimeout(() => {
              ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        }
      );
    }
  }

  submit(ignore_error = false) {
    this.executionInProgress = true;
    setTimeout(() => {
      const ResultElement = document.getElementById('submitCard');
      if (ResultElement) {
        ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 500);
    this.exerciseResult = null;
    this.verifyResult = null;
    this.submitResult = null;
    this.verifyResult = null;
    this.apiErrorOccurred = false;
    if (this.processedContent.handsOn.forFPCourse) {
      const lexId = this.processedContent.content.identifier;
      const exerciseDataFP = {
        user_solution: this.exerciseData.starterCodes[0],
        user_id_type: 'uuid',
        ignore_error
      };
      this.handsOnSvc.submitFp(lexId, exerciseDataFP).subscribe(
        data => {
          if (data) {
            this.submitData = { ...data };
            this.submitResult = this.submitData.submitResult;
            if (!this.submitResult.submitionStatus) {
              this.openExecutionDialog('submit');
            }
          }
          this.executionInProgress = false;
          const ResultElement = document.getElementById('submitCard');
          if (ResultElement) {
            setTimeout(() => {
              ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        },
        error => {
          this.submitResult = null;
          this.apiErrorOccurred = true;
          this.executionInProgress = false;
          const ResultElement = document.getElementById('submitCard');
          if (ResultElement) {
            setTimeout(() => {
              ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        }
      );
    } else {
      const lexId = this.processedContent.content.identifier;
      const exerciseDataCE = {
        language_code: this.exerciseData.supportedLanguages[0].id,
        user_solution: this.exerciseData.starterCodes[0],
        user_id_type: 'uuid',
        ignore_error
      };
      this.handsOnSvc.submitCe(lexId, exerciseDataCE).subscribe(
        data => {
          if (data) {
            this.submitData = { ...data };
            this.submitResult = this.submitData.submitResult;
            if (!this.submitResult.submitionStatus) {
              this.openExecutionDialog('submit');
            }
          }
          this.executionInProgress = false;
          const ResultElement = document.getElementById('submitCard');
          if (ResultElement) {
            setTimeout(() => {
              ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        },
        error => {
          this.submitResult = null;
          this.apiErrorOccurred = true;
          this.executionInProgress = false;
          const ResultElement = document.getElementById('submitCard');
          if (ResultElement) {
            setTimeout(() => {
              ResultElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
          }
        }
      );
    }
  }

  viewLastSubmission() {
    const lexId = this.processedContent.content.identifier;
    this.handsOnSvc.viewLastSubmission(lexId).subscribe(
      data => {
        if (data) {
          if (data === '---no submission found---') {
            this.openExecutionDialog('no-submit');
          } else {
            const viewLastSubmissionData: string = data as string;
            this.exerciseData.starterCodes[0] = viewLastSubmissionData;
          }
        }
      },
      error => {
        this.openExecutionDialog('no-submit');
      }
    );
  }

  copyToClipBoardFunction() {
    const id = 'mycustom-clipboard-textarea-hidden-id';
    let existsTextarea = document.getElementById(id) as HTMLTextAreaElement;
    if (!existsTextarea) {
      const textarea = document.createElement('textarea');
      textarea.id = id;
      // Place in top-left corner of screen regardless of scroll position.
      textarea.style.position = 'fixed';
      textarea.style.top = '0px';
      textarea.style.left = '0px';

      // Ensure it has a small width and height. Setting to 1px / 1em
      // doesn't work as this gives a negative w/h on some browsers.
      textarea.style.width = '1px';
      textarea.style.height = '1px';

      // We don't need padding, reducing the size if it does flash render.
      textarea.style.padding = '0px';

      // Clean up any borders.
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';

      // Avoid flash of white box if rendered for any reason.
      textarea.style.background = 'transparent';
      document.querySelector('body').appendChild(textarea);
      existsTextarea = document.getElementById(id) as HTMLTextAreaElement;
    } else {
    }

    existsTextarea.value = this.exerciseData.starterCodes[0];
    existsTextarea.select();

    try {
      const status = document.execCommand('copy');
      if (!status) {
        console.error('Cannot copy text');
      } else {
        const tooltip = document.getElementById('myTooltip');
        tooltip.innerHTML = 'Code Copied!';
      }
    } catch (err) {}
  }

  outFunc() {
    const tooltip = document.getElementById('myTooltip');
    tooltip.innerHTML = 'Copy to clipboard';
  }

  private raiseRealTimeProgress() {
    // To Do Fix later. Done to accommodate realTimeProgress.
    if (this.processedContent.content.resourceType === 'Exercise') {
      return;
    }
    this.realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      current: ['1'],
      max_size: 1
    };
    if (this.realTimeProgressTimer) {
      clearTimeout(this.realTimeProgressTimer);
    }
    this.hasFiredRealTimeProgress = false;
    this.realTimeProgressTimer = setTimeout(() => {
      this.hasFiredRealTimeProgress = true;
      this._fireRealTimeProgress();
    }, 2 * 60 * 1000);
  }
  private _fireRealTimeProgress() {
    // To Do Fix later. Done to accommodate realTimeProgress.
    if (this.processedContent.content.resourceType === 'Exercise') {
      return;
    }
    this.realTimeProgressRequest.content_type = this.processedContent.content.contentType;
    this.userSvc
      .realTimeProgressUpdate(this.processedContent.content.identifier, this.realTimeProgressRequest)
      .subscribe();
  }
}
