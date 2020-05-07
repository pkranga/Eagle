/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { MatDialog, MatSidenav } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../../../../services/user.service';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { FetchStatus } from '../../../../models/status.model';
import { ValuesService } from '../../../../services/values.service';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { IQuestion, IQuizSubmitRequest, IQuizSubmitResponse, quizViewMode, TQuizSubmissionState, userSelectionType } from '../../model/quiz.model';
import { QuizService } from '../../services/quiz.service';
import { QuestionComponent } from '../question/question.component';
import { SubmitQuizDialogComponent } from '../submit-quiz-dialog/submit-quiz-dialog.component';

let requestCount = 0;

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnChanges, OnDestroy {
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;
  @ViewChildren('questionsReference') questionsReference: QueryList<
    QuestionComponent
  >;
  @ViewChild('sidenav', { static: false }) sideNav: MatSidenav;

  viewState: quizViewMode = 'initial';
  timeLeft: number;
  startTime: number;
  timerSubscription: Subscription;
  markedQuestions = new Set([]);
  currentQuestionIndex = 0;
  isCompleted = false;
  isSubmitted = false;
  questionAnswerHash: { [questionId: string]: string[] } = {};
  passPercentage: number;
  result: number;
  @ViewChild('submitModal', { static: false })
  submitModal: ElementRef;
  numCorrectAnswers: number;
  numIncorrectAnswers: number;
  numUnanswered: number;
  fetchingResultsStatus: FetchStatus;

  isIdeal = false;
  telemetrySubscription: Subscription;

  currentTheme: string;

  sidenavOpenDefault: boolean;
  sidenavMode: string;

  submissionState: TQuizSubmissionState;

  get uniqueId() {
    return 'quiz_plugin_container' + ++requestCount;
  }

  constructor(
    public dialog: MatDialog,
    private quizSvc: QuizService,
    private userSvc: UserService,
    private valuesSvc: ValuesService,
    private route: ActivatedRoute
  ) {}
  paramSubscription;
  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
    });
    this.valuesSvc.theme$.subscribe(value => {
      // console.log(value);
      this.currentTheme = value.className;
      this.sidenavMode = value ? 'over' : 'side';
    });
    this.valuesSvc.isXSmall$.subscribe(value => {
      this.sidenavOpenDefault = !value;
    });
    this.quizSvc.firePlayerTelemetryEvent(
      this.processedContent.content.identifier,
      this.collectionId,
      MIME_TYPE.quiz,
      undefined,
      this.isCompleted,
      'LOADED',
      this.isIdeal,
      true
    );
  }

  scroll(qIndex: number) {
    if (!this.sidenavOpenDefault) {
      this.sideNav.close();
    }
    const questionElement = document.getElementById('question' + qIndex);
    if (questionElement) {
      questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    for (const change in changes) {
      if (change === 'quiz') {
        if (
          this.processedContent.quiz &&
          this.processedContent.quiz.timeLimit
        ) {
          this.processedContent.quiz.timeLimit *= 1000;
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    if (this.telemetrySubscription) {
      this.telemetrySubscription.unsubscribe();
    }
  }

  overViewed(event: userSelectionType) {
    if (event === 'start') {
      this.startQuiz();
      this.telemetrySubscription = interval(30000).subscribe(() => {
        this.quizSvc.firePlayerTelemetryEvent(
          this.processedContent.content.identifier,
          this.collectionId,
          MIME_TYPE.quiz,
          undefined,
          this.isCompleted,
          'RUNNING',
          this.isIdeal
        );
      });
    } else if (event === 'skip') {
      alert('skip quiz TBI');
    }
  }

  startQuiz() {
    this.sidenavOpenDefault = true;
    setTimeout(() => {
      this.sidenavOpenDefault = false;
    }, 500);
    this.viewState = 'attempt';
    this.startTime = Date.now();
    this.markedQuestions = new Set([]);
    this.questionAnswerHash = {};
    this.currentQuestionIndex = 0;
    this.timeLeft = this.processedContent.quiz.timeLimit;
    if (this.processedContent.quiz.timeLimit > -1) {
      this.timerSubscription = interval(100)
        .pipe(
          map(
            () =>
              this.startTime + this.processedContent.quiz.timeLimit - Date.now()
          )
        )
        .subscribe(timeRemaining => {
          this.timeLeft -= 0.1;
          if (this.timeLeft < 0) {
            this.isIdeal = true;
            this.timeLeft = 0;
            this.timerSubscription.unsubscribe();
            this.submitQuiz();
          }
        });
    }
  }

  fillSelectedItems(question: IQuestion, optionId: string) {
    if (this.viewState === 'answer') {
      this.questionsReference.forEach(questionReference => {
        questionReference.reset();
      });
    }
    this.viewState = 'attempt';
    if (
      this.questionAnswerHash[question.questionId] &&
      question.multiSelection
    ) {
      const questionIndex = this.questionAnswerHash[
        question.questionId
      ].indexOf(optionId);
      if (questionIndex === -1) {
        this.questionAnswerHash[question.questionId].push(optionId);
      } else {
        this.questionAnswerHash[question.questionId].splice(questionIndex, 1);
      }
      if (!this.questionAnswerHash[question.questionId].length) {
        delete this.questionAnswerHash[question.questionId];
      }
    } else {
      this.questionAnswerHash[question.questionId] = [optionId];
    }
  }

  proceedToSubmit() {
    if (this.timeLeft) {
      if (
        Object.keys(this.questionAnswerHash).length !==
        this.processedContent.quiz.questions.length
      ) {
        this.submissionState = 'unanswered';
      } else if (this.markedQuestions.size) {
        this.submissionState = 'marked';
      } else {
        this.submissionState = 'answered';
      }
      const dialogRef = this.dialog.open(SubmitQuizDialogComponent, {
        width: '250px',
        data: this.submissionState
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.submitQuiz();
        }
      });
    }
  }

  submitQuiz() {
    this.isSubmitted = true;
    this.ngOnDestroy();
    if (!this.processedContent.quiz.isAssessment) {
      this.viewState = 'review';
      this.calculateResults();
    } else {
      this.viewState = 'answer';
    }

    this.fetchingResultsStatus = 'fetching';
    // if (this.processedContent.quiz.isAssessment) {
    //   this.fetchingResultsStatus = 'fetching';
    // } else {
    //   this.fetchingResultsStatus = 'done';
    // }
    const requestData: IQuizSubmitRequest = this.quizSvc.createAssessmentSubmitRequest(
      this.processedContent.content.identifier,
      this.processedContent.content.name,
      {
        ...this.processedContent.quiz,
        timeLimit: this.processedContent.quiz.timeLimit * 1000
      },
      this.questionAnswerHash
    );

    this.userSvc.submitQuiz(requestData).subscribe(
      (res: IQuizSubmitResponse) => {
        if (this.processedContent.quiz.isAssessment) {
          this.isIdeal = true;
        }
        this.fetchingResultsStatus = 'done';
        this.numCorrectAnswers = res.correct;
        this.numIncorrectAnswers = res.inCorrect;
        this.numUnanswered = res.blank;
        this.passPercentage = res.passPercent;
        this.result = res.result;
        if (this.result >= this.passPercentage) {
          this.isCompleted = true;
        }

        const result = {
          result:
            (this.numCorrectAnswers * 100.0) /
            this.processedContent.quiz.questions.length,
          total: this.processedContent.quiz.questions.length,
          blank: res.blank,
          correct: res.correct,
          inCorrect: res.inCorrect,
          passPercentage: res.passPercent
        };
        this.quizSvc.firePlayerTelemetryEvent(
          this.processedContent.content.identifier,
          this.collectionId,
          MIME_TYPE.quiz,
          result,
          this.isCompleted,
          'DONE',
          this.isIdeal,
          true
        );
        const top = document.getElementById('quiz-end');
        if (top !== null) {
          top.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      },
      error => {
        this.fetchingResultsStatus = 'error';
      }
    );
  }

  showAnswers() {
    this.showMtfAnswers();
    this.showFitbAnswers();
    this.viewState = 'answer';
  }

  showMtfAnswers() {
    this.questionsReference.forEach(questionReference => {
      questionReference.matchShowAnswer();
    });
  }

  showFitbAnswers() {
    this.questionsReference.forEach(questionReference => {
      questionReference.functionChangeBlankBorder();
    });
  }

  calculateResults() {
    const correctAnswers = this.processedContent.quiz.questions.map(
      question => {
        return {
          questionType: question.questionType,
          questionId: question.questionId,
          correctOptions: question.options
            .filter(option => option.isCorrect)
            .map(option =>
              question.questionType === 'fitb' ? option.text : option.optionId
            ),
          correctMtfOptions: question.options
            .filter(option => option.isCorrect)
            .map(option =>
              question.questionType === 'mtf' ? option : undefined
            )
        };
      }
    );
    // console.log(correctAnswers)
    this.numCorrectAnswers = 0;
    this.numIncorrectAnswers = 0;
    correctAnswers.forEach(answer => {
      const correctOptions = answer.correctOptions;
      const correctMtfOptions = answer.correctMtfOptions;
      let selectedOptions: any =
        this.questionAnswerHash[answer.questionId] || [];
      if (
        answer.questionType === 'fitb' &&
        this.questionAnswerHash[answer.questionId] &&
        this.questionAnswerHash[answer.questionId][0]
      ) {
        selectedOptions =
          this.questionAnswerHash[answer.questionId][0].split(',') || [];
        let correctFlag = true;
        let unTouched = false;
        if (selectedOptions.length < 1) {
          unTouched = true;
        }
        if (correctOptions.length !== selectedOptions.length) {
          correctFlag = false;
        }
        if (correctFlag && !unTouched) {
          for (let i = 0; i < correctOptions.length; i++) {
            if (
              correctOptions[i].trim().toLowerCase() !==
              selectedOptions[i].trim().toLowerCase()
            ) {
              correctFlag = false;
            }
          }
        }
        if (correctFlag && !unTouched) {
          this.numCorrectAnswers += 1;
        } else if (!unTouched) {
          this.numIncorrectAnswers += 1;
        }
        this.showFitbAnswers();
      } else if (answer.questionType === 'mtf') {
        let unTouched = false;
        let correctFlag = true;
        if (selectedOptions.length < 1 || selectedOptions[0].length < 1) {
          unTouched = true;
        } else if (selectedOptions[0].length < correctMtfOptions.length) {
          correctFlag = false;
        }
        if (selectedOptions && selectedOptions[0]) {
          // console.log(selectedOptions)
          // console.log(correctOptions)
          selectedOptions[0].forEach(element => {
            const b = element.sourceId;
            const c = element.targetId;
            if (
              correctMtfOptions[(b.slice(-1) as number) - 1].match.trim() ===
              element.target.innerHTML.trim()
            ) {
              element.setPaintStyle({
                stroke: '#357a38'
              });
              this.setBorderColor(element, '#357a38');
            } else {
              element.setPaintStyle({
                stroke: '#f44336'
              });
              correctFlag = false;
              this.setBorderColor(element, '#f44336');
            }
          });
        }
        if (correctFlag && !unTouched) {
          this.numCorrectAnswers += 1;
        } else if (!unTouched) {
          this.numIncorrectAnswers += 1;
        }
      } else {
        if (
          correctOptions.sort().join(',') === selectedOptions.sort().join(',')
        ) {
          this.numCorrectAnswers += 1;
        } else if (selectedOptions.length > 0) {
          this.numIncorrectAnswers += 1;
        }
      }
    });
    this.numUnanswered =
      this.processedContent.quiz.questions.length -
      this.numCorrectAnswers -
      this.numIncorrectAnswers;
  }

  setBorderColor(connection, color) {
    document.getElementById(connection.sourceId).style.borderColor = color;
    document.getElementById(connection.targetId).style.borderColor = color;
  }

  // resetQuiz() {
  //   this.viewState = 'initial';
  // }

  isQuestionAttempted(questionId: string): boolean {
    return !(Object.keys(this.questionAnswerHash).indexOf(questionId) === -1);
  }

  isQuestionMarked(questionId: string) {
    return this.markedQuestions.has(questionId);
  }

  markQuestion(questionId: string) {
    if (this.markedQuestions.has(questionId)) {
      this.markedQuestions.delete(questionId);
    } else {
      this.markedQuestions.add(questionId);
    }
  }
}
;