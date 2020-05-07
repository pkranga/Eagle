/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { IContent } from '../../../../models/content.model';
import { IData, IUserFetchFeedbackRequest, IUserFetchMySubmissionsResponse } from '../../../../models/exercise-submission.model';
import { ResolveResponse } from '../../../../models/routeResolver.model';
import { AuthService } from '../../../../services/auth.service';
import { ExerciseService } from '../../../../services/exercise-submission.service';
import { RoutingService } from '../../../../services/routing.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { ValuesService } from '../../../../services/values.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  @ViewChild('errorOccured', { static: true }) errorOccuredToast: ElementRef;
  @ViewChild('feedbackSuccess', { static: true }) feedbackSuccessToast: ElementRef;
  exerciseResponse: ResolveResponse<IUserFetchMySubmissionsResponse[]>;
  contentResponse: ResolveResponse<IContent>;
  exerciseContent: IUserFetchMySubmissionsResponse;
  paramSubscription: Subscription;
  contentId: string;
  submissionId: string;
  emailId: string;
  data: IData;
  request = {
    feedback: null,
    educator_id: ''
  };
  numbersPattern = /^[1-9]\d*/;
  submittingInProgress = false;
  previousFeedback: string;
  fetchingFeedback = false;
  errorMessageCode: 'API_FAILURE';
  showPreviousFeedback = false;
  fileUploadUrl: string;
  content: IContent;

  constructor(
    private snackBar: MatSnackBar,
    public routingSvc: RoutingService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private exerciseService: ExerciseService,
    private router: Router,
    private valuesSvc: ValuesService,
    private telemetrySvc: TelemetryService
  ) { }

  ngOnInit() {
    this.data = {
      type: '',
      url: '',
      emailId: '',
      submissionId: '',
      submissionDate: ''
    };

    this.paramSubscription = this.route.queryParamMap.subscribe(params => {
      this.contentId = params.get('contentId');
      this.submissionId = params.get('submissionId');
      this.emailId = params.get('emailId');
      this.exerciseResponse = this.route.snapshot.data['exerciseContent'];
      this.contentResponse = this.route.snapshot.data['tocContent'];
      if (!this.exerciseResponse.error) {
        this.exerciseContent = this.exerciseResponse.data[0];
        if (this.exerciseContent) {
          this.data.type = this.exerciseContent.submission_type;
          this.data.url = this.exerciseContent.submission_url;
          this.data.emailId = this.exerciseContent.submitted_by_email;
          this.data.submissionDate = this.exerciseContent.submission_time;
          this.data.submissionId = this.exerciseContent.submission_id;
          if (this.exerciseContent.feedback_url) {
            this.exerciseContent.feedback_url = (
              this.exerciseContent.feedback_url || ''
            ).replace(this.valuesSvc.CONTENT_URL_PREFIX_REGEX, '');
            this.exerciseService
              .fetchFeedbackText(this.exerciseContent.feedback_url)
              .subscribe(
                data => {
                  this.request.feedback = data;
                }
              );
          }
          // if (this.exerciseContent.is_feedback_for_older_sumbission === 1) {
          //   this.isPreviousFeedback = true;
          //   // this.fetchPreviousFeedback(this.exerciseContent.old_feedback_submission_id, this.emailId);
          // }
        }
      } else if (this.exerciseResponse.error === 'invalid_url') {
        this.router.navigateByUrl('/not-found');
      } else {
        // this.router.navigateByUrl('/not-found');
      }
      if (!this.contentResponse.error) {
        this.content = this.contentResponse.content;
      }
    });
  }

  createContentDirectory(file, form) {
    this.exerciseService.createContentDirectory(this.contentId).subscribe(
      data => {
        if (data.code === 201) {
          this.fileUploadToContentDirectory(file, form);
        }
      },
      err => {
        if (err.status === 409) {
          this.fileUploadToContentDirectory(file, form);
        } else {
          this.submittingInProgress = false;
          this.snackBar.open(this.errorOccuredToast.nativeElement.value);
        }
      }
    );
  }

  fileUploadToContentDirectory(file, form) {
    const date = new Date();
    const fileName = 'Feedback_' + date.getFullYear()
      + '_' + String(Number(date.getMonth()) + 1)
      + '_' + date.getDate() + '_'
      + date.getHours() + '_'
      + date.getMinutes() + '_'
      + date.getMilliseconds()
      + '.txt';
    const formData = new FormData();
    formData.append('file', file, fileName);
    this.exerciseService
      .fileUploadToContentDirectory(formData, this.contentId)
      .subscribe(
        data => {
          this.fileUploadUrl = data.contentUrl;
          if (this.fileUploadUrl) {
            this.saveFeedback(file, form);
          }
        },
        err => {
          console.log('submission error', err);
          this.submittingInProgress = false;
          this.snackBar.open(this.errorOccuredToast.nativeElement.value);
        }
      );
  }

  saveFeedback(file, form) {
    const req: IUserFetchFeedbackRequest = {
      feedback_type: 'input',
      url: this.fileUploadUrl,
      educator_id: this.auth.userEmail,
      feedback: this.request.feedback,
      user_id_type: 'email',
      max_rating: 5,
      rating: 0
    };
    this.exerciseService
      .provideFeedback(req, this.contentId, this.submissionId, this.data.emailId)
      .subscribe(
        response => {
          if (response) {
            this.snackBar.open(this.feedbackSuccessToast.nativeElement.value);
            this.submittingInProgress = false;
            this.telemetrySvc.submitExerciseFeedbackTelemetryEvent(
              this.submissionId, this.auth.userEmail, new Date().getTime()
            );
            form.resetForm();
          }
        },
        err => {
          this.snackBar.open(this.errorOccuredToast.nativeElement.value);
          this.submittingInProgress = false;
        }
      );
  }

  submitFeedback(form) {
    this.submittingInProgress = true;
    const file = new File([this.request.feedback], 'submission-feedback.txt');
    this.createContentDirectory(file, form);
  }

  fetchPreviousFeedback() {
    if (!this.previousFeedback) {
      this.fetchingFeedback = true;
      this.exerciseService
        .fetchSubmission(
          this.contentId,
          this.exerciseContent.old_feedback_submission_id,
          this.emailId
        )
        .subscribe(
          submission => {
            if (submission && submission.length && submission[0].feedback_url) {
              submission[0].feedback_url = (
                submission[0].feedback_url || ''
              ).replace(this.valuesSvc.CONTENT_URL_PREFIX_REGEX, '');
              this.exerciseService
                .fetchFeedbackText(submission[0].feedback_url)
                .subscribe(
                  data => {
                    this.previousFeedback = data;
                  },
                  err => {
                    this.errorMessageCode = 'API_FAILURE';
                  }
                );
            }
            this.scrollToPrevFeeback();
            this.fetchingFeedback = false;
          },
          err => {
            this.fetchingFeedback = false;
            this.errorMessageCode = 'API_FAILURE';
          }
        );
    }
  }

  scrollToPrevFeeback() {
    // this.fetchPreviousFeedback();
    this.showPreviousFeedback = true;
    const prevFeebackElement = document.getElementById('prevFeedback');
    if (prevFeebackElement) {
      prevFeebackElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
