/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { MatSnackBar } from '@angular/material';
import { IFeedbackConfig } from '../../../../models/wingspan-pages.model';

@Component({
  selector: 'ws-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {

  @Input() config: IFeedbackConfig;
  ratingLoop: number[] = [];
  feedbackRequest;
  submitInProgress: boolean = false;
  @ViewChild('toastSuccess', { static: true }) toastSuccess: ElementRef<any>;
  @ViewChild('toastError', { static: true }) toastError: ElementRef<any>;
  constructor(private authService: AuthService, private userSvc: UserService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.resetForm();
  }
  resetForm() {
    this.ratingLoop = new Array(5);
    this.ratingLoop.fill(1);
    this.feedbackRequest = {
      contentId: null,
      feedbackSubType: null,
      rating: '',
      feedback: [
        {
          question: 'Provide your suggestion',
          meta: 'ocm',
          answer: ''
        },
      ],
      feedbackType: 'ocm'
    }
  }
  submitFeedback(feedbackRequest, feedbackForm) {
    this.submitInProgress = true;
    this.userSvc.submitFeedback(feedbackRequest).subscribe(
      data => {
        this.resetForm();
        feedbackForm.resetForm();
        this.submitInProgress = false;
        this.snackBar.open(this.toastSuccess.nativeElement.value);
      },
      err => {
        this.snackBar.open(this.toastError.nativeElement.value);
        this.submitInProgress = false;
      }
    );
  }

}
