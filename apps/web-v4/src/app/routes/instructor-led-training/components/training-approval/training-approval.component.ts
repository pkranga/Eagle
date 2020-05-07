/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { ITrainingRequest } from '../../../../models/training.model';
import { TrainingsService } from '../../../../services/trainings.service';

@Component({
  selector: 'app-training-approval',
  templateUrl: './training-approval.component.html',
  styleUrls: ['./training-approval.component.scss']
})
export class TrainingApprovalComponent implements OnInit {
  @ViewChild('error', { static: true }) errorSnackBar: TemplateRef<any>;
  trainingRequests: ITrainingRequest[];
  fetchStatus: 'fetching' | 'done' = 'fetching';

  constructor(private trainingSvc: TrainingsService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.trainingSvc.getTrainingRequests().subscribe(
      requests => {
        this.trainingRequests = requests;
        this.fetchStatus = 'done';
      },
      () => {
        this.trainingRequests = [];
        this.fetchStatus = 'done';
        this.snackBar.openFromTemplate(this.errorSnackBar);
      }
    );
  }

  onTrainingRejected(offeringId: string) {
    this.trainingRequests = this.trainingRequests.filter(request => request.offering_id !== offeringId);
  }
}
