/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { throwError, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material';

import { RoutingService } from '../../../../services/routing.service';
import { TrainingsService } from '../../../../services/trainings.service';
import { ITrainingFeedbackQuestion, ITrainingFeedbackAnswer } from '../../../../models/training.model';

@Component({
  selector: 'app-training-feedback',
  templateUrl: './training-feedback.component.html',
  styleUrls: ['./training-feedback.component.scss']
})
export class TrainingFeedbackComponent implements OnInit {
  @ViewChild('questionsUnanswered', { static: true }) questionsUnanswered: TemplateRef<any>;
  @ViewChild('success', { static: true }) successSnackbar: TemplateRef<any>;
  @ViewChild('fail', { static: true }) failSnackbar: TemplateRef<any>;
  feedbackType: string;
  offeringId: string;
  formId: string;
  formData: ITrainingFeedbackQuestion[];
  feedback: {
    question: ITrainingFeedbackQuestion;
    answer: ITrainingFeedbackAnswer;
  }[] = [];
  submitStatus: 'submitting' | 'done';
  formFetchStatus: 'fetching' | 'done' | 'error';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public routingSvc: RoutingService,
    private trainingsSvc: TrainingsService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit() {
    this.formFetchStatus = 'fetching';

    this.formId = this.route.snapshot.queryParamMap.get('form');
    if (!this.formId) {
      this.router.navigate(['/training/instructor-led']);
    }

    this.feedbackType = this.route.snapshot.paramMap.get('feedback_type');
    this.offeringId = this.route.snapshot.paramMap.get('offering_id');

    this.trainingsSvc
      .getTrainingFeedbackForm(this.formId)
      .pipe(
        switchMap(form => {
          if (!form || !form.length) {
            return throwError(form);
          }

          return of(form);
        })
      )
      .subscribe(
        questions => {
          questions.forEach(question => {
            this.feedback.push({
              question: { ...question },
              answer: {
                question_id: question.question_id,
                rating: undefined,
                rating_reason: undefined,
                type: question.type
              }
            });
          });

          this.formFetchStatus = 'done';
        },
        () => {
          this.formFetchStatus = 'error';
        }
      );
  }

  onBtnSubmitClick() {
    let valid = true;
    const feedbackAnswers: ITrainingFeedbackAnswer[] = [];

    for (const feedbackItem of this.feedback) {
      const answer = feedbackItem.answer;

      if (
        ((answer.type === 'rating' || answer.type === 'bool') && !answer.rating) ||
        ((answer.type === 'rating' || answer.type === 'bool') && answer.rating < 3 && !answer.rating_reason) ||
        (answer.type === 'text' && !answer.rating_reason)
      ) {
        this.snackbar.openFromTemplate(this.questionsUnanswered);
        valid = false;
        break;
      }

      feedbackAnswers.push({
        ...answer,
        rating: answer.rating ? +answer.rating : 0,
        rating_reason: answer.rating_reason ? answer.rating_reason : ''
      });
    }

    if (valid) {
      this.submitStatus = 'submitting';
      this.trainingsSvc.submitTrainingFeedback(this.offeringId, this.formId, feedbackAnswers).subscribe(
        () => {
          this.snackbar.openFromTemplate(this.successSnackbar);
          this.router.navigate(['/training'], {
            state: {
              tab: 'feedback'
            }
          });
        },
        () => {
          this.snackbar.openFromTemplate(this.failSnackbar);
        }
      );
    }
  }
}
