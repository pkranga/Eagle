/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { ProjectEndorsementService } from '../../services/project-endorsement.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
@Component({
  selector: 'ws-dialog-reject-request',
  templateUrl: './dialog-reject-request.component.html',
  styleUrls: ['./dialog-reject-request.component.scss']
})
export class DialogRejectRequestComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<DialogRejectRequestComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private projectEndorsementService: ProjectEndorsementService
  ) {}

  ngOnInit() {}
  rejectEndorsement(endorseId) {
    const obj = {
      endorseId,
      status: 'rejected'
    };
    this.projectEndorsementService.endorseRequest(obj).subscribe(res => {
      this.dialogRef.close();
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
