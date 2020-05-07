/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TelemetryService } from '../../../../services/telemetry.service';
import { IContent } from '../../../../models/content.model';
import { IUserFetchGroupForEducatorResponse, IUserFetchLatestSubmissionsResponse } from '../../../../models/exercise-submission.model';
import { ResolveResponse } from '../../../../models/routeResolver.model';
import { ExerciseService } from '../../../../services/exercise-submission.service';
import { RoutingService } from '../../../../services/routing.service';
import { ViewContentDialogComponent } from '../view-content-dialog/view-content-dialog.component';

@Component({
  selector: 'app-educator-home',
  templateUrl: './educator-home.component.html',
  styleUrls: ['./educator-home.component.scss']
})

export class EducatorHomeComponent implements OnInit {

  exerciseResponse: ResolveResponse<IContent>;
  submissionData: IUserFetchLatestSubmissionsResponse;
  groups: IUserFetchGroupForEducatorResponse[];
  selectedGroup: IUserFetchGroupForEducatorResponse;
  paramSubscription: Subscription;
  contentId: string;
  fetchingGroup = false;
  fetchingData = false;
  content: IContent;
  errorMessageCode: 'API_FAILURE' | 'INVALID_CONTENT_ID';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private exerciseService: ExerciseService,
    private telemetrySvc: TelemetryService
  ) { }

  ngOnInit() {
    this.paramSubscription = this.route.paramMap.subscribe(params => {
      this.contentId = params.get('contentId');
    });

    this.paramSubscription = this.route.paramMap.subscribe(params => {
      this.contentId = params.get('contentId');
      this.exerciseResponse = this.route.snapshot.data['tocContent'];
      if (!this.exerciseResponse.error) {
        this.content = this.exerciseResponse.content;
      } else if (this.exerciseResponse.error === 'invalid_content_id') {
        this.errorMessageCode = 'INVALID_CONTENT_ID';
      } else {
        this.content = this.exerciseResponse.content;
      }
    });
    this.getEducatorGroups();
  }

  showLearnerView() {
    this.router.navigateByUrl('/submission/learner/' + this.contentId);
  }

  getEducatorGroups() {
    this.fetchingGroup = true;
    this.exerciseService.fetchGroupForEducator().subscribe((data: IUserFetchGroupForEducatorResponse[]) => {
      this.groups = data;
      this.selectedGroup = this.groups[0];
      this.getLearnersSubmissionData(this.selectedGroup);
      this.fetchingGroup = false;
    }, err => {
      this.fetchingGroup = false;
    });
  }

  getLearnersSubmissionData(group: IUserFetchGroupForEducatorResponse) {
    this.fetchingData = true;
    this.exerciseService.fetchLearnerSubmissionData(this.contentId, group.group_id)
      .subscribe((data: IUserFetchLatestSubmissionsResponse) => {
        if (data) {
          this.submissionData = data;
        }
        this.fetchingData = false;
      }, err => {
        this.fetchingData = false;
        this.errorMessageCode = 'API_FAILURE';
      });
  }

  viewContent(learner) {
    const dialogRef = this.dialog.open(ViewContentDialogComponent, {
      width: '700px',
      data: {
        type: learner.submission_type,
        url: learner.submission_url,
        emailId: learner.submitted_by_email,
        submissionId: learner.submission_id,
        submissionDate: learner.submission_time,
        contentId: this.contentId,
        isEducator: true,
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

  provideFeedback(submission_id: string, email: string) {
    this.router.navigate(
      ['/submission/feedback'],
      {
        queryParams:
        {
          contentId: this.contentId,
          submissionId: submission_id,
          emailId: email
        }
      }
    );
  }
}
