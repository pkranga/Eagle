/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ITrainingFeedbackOffering } from '../../../../models/training.model';
import { TrainingsService } from '../../../../services/trainings.service';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss']
})
export class FeedbackListComponent implements OnInit {
  trainings: ITrainingFeedbackOffering[];
  fetchStatus: FetchStatus;

  constructor(private trainingSvc: TrainingsService) {}

  ngOnInit() {
    this.fetchStatus = 'fetching';
    this.trainingSvc.getTrainingsForFeedback().subscribe(
      trainingsData => {
        this.trainings = trainingsData;
        this.fetchStatus = 'done';
      },
      () => {
        this.fetchStatus = 'error';
      }
    );
  }
}
