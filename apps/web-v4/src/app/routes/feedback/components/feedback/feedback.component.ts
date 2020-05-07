/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { UserService } from '../../../../services/user.service';
import { RoutingService } from '../../../../services/routing.service';
import { TelemetryService } from '../../../../services/telemetry.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  // maintain same order in html for tabs
  tabs = ['application', 'applicationcontent', 'bug'];
  currentTabIndex = 0;
  feedbackRequest: any;
  submitInProgress = false;
  ratingLoop: number[] = [];
  numbersPattern = /^[1-9]\d*/;
  @ViewChild('toastSuccess', { static: true }) toastSuccess: ElementRef<any>;
  @ViewChild('toastError', { static: true }) toastError: ElementRef<any>;
  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public routingSvc: RoutingService,
    private telemetrySvc: TelemetryService,
    private activatedRoute: ActivatedRoute,
    private userSvc: UserService
  ) {}

  ngOnInit() {
    this.resetFeedbackForm();
    this.activatedRoute.paramMap.subscribe(params => {
      const param = params.get('type');
      this.currentTabIndex =
        this.tabs.indexOf(param) > -1 ? this.tabs.indexOf(param) : 0;
    });
  }

  submitFeedback(request, form) {
    this.submitInProgress = true;
    this.userSvc.submitFeedback(request).subscribe(
      data => {
        this.telemetrySvc.feedbackTelemetryEvent(
          this.tabs[this.currentTabIndex],
          undefined
        );
        this.resetFeedbackForm();
        form.resetForm();
        this.submitInProgress = false;
        this.openSnackbar(this.toastSuccess.nativeElement.value);
      },
      err => {
        this.openSnackbar(this.toastError.nativeElement.value);
        this.submitInProgress = false;
        // console.log('err >', err);
      }
    );
  }

  updateRoute(index: number) {
    if (!this.tabs[index]) {
      index = 0;
    }
    this.router.navigate(['feedback', this.tabs[index]]);
  }

  private openSnackbar(primaryMsg: string, duration: number = 3000) {
    this.snackBar.open(primaryMsg, undefined, {
      duration
    });
  }

  resetFeedbackForm() {
    this.ratingLoop = new Array(5);
    this.ratingLoop.fill(1);
    this.feedbackRequest = {
      application: {
        contentId: null,
        feedback: [
          {
            question: 'I Like',
            meta: 'I Like',
            answer: ''
          },
          {
            question: 'I Wish',
            meta: 'I Wish',
            answer: ''
          }
        ],
        feedbackSubType: null,
        feedbackType: 'application',
        rating: '-1'
      },
      applicationcontent: {
        contentId: null,
        feedback: [
          {
            question: 'I Like',
            meta: 'I Like',
            answer: ''
          },
          {
            question: 'I Wish',
            meta: 'I Wish',
            answer: ''
          }
        ],
        feedbackSubType: null,
        feedbackType: 'applicationcontent',
        rating: '-1'
      },
      bug: {
        contentId: null,
        feedback: [
          {
            question: 'Share with us what you have found',
            meta: 'bug',
            answer: ''
          }
        ],
        feedbackSubType: null,
        feedbackType: 'bug'
      }
    };
  }
}
