/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit , Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ProjectEndorsementService } from '../../services/project-endorsement.service';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'ws-dialog-approve-request',
  templateUrl: './dialog-approve-request.component.html',
  styleUrls: ['./dialog-approve-request.component.scss']
})
export class DialogApproveRequestComponent implements OnInit {
  approverDescription:string;
  ratingLoop = [];
  ratingRequest = {
    rating: '-1'
  };
  requestForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogApproveRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private projectEndorsementService: ProjectEndorsementService) { }

  ngOnInit() {
    this.ratingLoop = new Array(5);
    this.ratingLoop.fill(1);
  }
  approveEndorsement() {
    const obj = {
      endorseId: this.data.endorse_id,
      status: 'approved',
      rating: this.ratingRequest.rating,
      approverDescription: this.approverDescription
    };
    this.projectEndorsementService.endorseRequest(obj).subscribe(res => {
      this.dialogRef.close('approved');
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
