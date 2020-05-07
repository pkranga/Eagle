/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { TrainingApiService } from '../../../../apis/training-api.service'
import { ITrainingRequest } from '../../../../models/training-api.model'

@Component({
  selector: 'ws-app-training-approval',
  templateUrl: './training-approval.component.html',
  styleUrls: ['./training-approval.component.scss'],
})
export class TrainingApprovalComponent implements OnInit {
  trainingRequests!: ITrainingRequest[]
  fetchStatus: 'fetching' | 'done' = 'fetching'

  constructor(private trainingApi: TrainingApiService) {}

  ngOnInit() {
    this.trainingApi.getPendingTrainingRequests().subscribe(
      requests => {
        this.trainingRequests = requests
        this.fetchStatus = 'done'
      },
      () => {
        this.trainingRequests = []
        this.fetchStatus = 'done'
      },
    )
  }

  onTrainingRejected(offeringId: string) {
    this.trainingRequests = this.trainingRequests.filter(
      request => request.offering_id !== offeringId,
    )
  }
}
