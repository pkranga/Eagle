/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ITrainingRequest } from '../../../../models/training.model';
import { TrainingRejectDialogComponent } from '../training-reject-dialog/training-reject-dialog.component';

@Component({
  selector: 'app-training-request-card',
  templateUrl: './training-request-card.component.html',
  styleUrls: ['./training-request-card.component.scss']
})
export class TrainingRequestCardComponent implements OnInit {
  @Input() trainingRequest: ITrainingRequest;
  @Output() trainingRejected: EventEmitter<any> = new EventEmitter();

  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  onBtnRejectClick() {
    const dialogRef = this.dialog.open(TrainingRejectDialogComponent, {
      data: this.trainingRequest
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingRejected.emit(this.trainingRequest.offering_id);
      }
    });
  }
}
