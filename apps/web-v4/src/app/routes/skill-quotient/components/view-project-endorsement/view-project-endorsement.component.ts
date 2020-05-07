/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject, Output, Input } from '@angular/core';
import { ProjectEndorsementService } from '../../services/project-endorsement.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';
import * as mySkills from '../../../../models/my-skills.model';
import { DialogApproveRequestComponent } from '../dialog-approve-request/dialog-approve-request.component';
import { DialogRejectRequestComponent } from '../dialog-reject-request/dialog-reject-request.component';
import { ConfigService } from '../../../../services/config.service';
/**
 * CODE_REVIEW:
 * why would you put multiple components in one file
 * that too, in wrong order, how can you use a data variable
 * before even declaring it
 *
 * variable names should be camel cased.
 *
 */
// @Component({
//   selector: 'app-dialog-reject-project-endorsement',
//   templateUrl: './dialog-reject-project-endorsement.html'
// })
// export class DialogRejectProjectEndorsementComponent {
//   constructor(
//     public dialogRef: MatDialogRef<DialogRejectProjectEndorsementComponent>,
//     @Inject(MAT_DIALOG_DATA) public data,
//     private projectEndorsementService: ProjectEndorsementService
//   ) {}
//   rejectEndorsement(endorseId) {
//     const obj = {
//       endorse_id: endorseId,
//       status: 'rejected'
//     };
//     this.projectEndorsementService.endorseRequest(obj).subscribe(res => {
//       this.dialogRef.close();
//     });
//   }
//   closeDialog() {
//     this.dialogRef.close();
//   }
// }

// @Component({
//   selector: 'app-dialog-approve-project-endorsement',
//   templateUrl: './dialog-approve-project-endorsement.html'
// })
// export class DialogApproveProjectEndorsementComponent implements OnInit {
//   constructor(
//     public dialogRef: MatDialogRef<DialogApproveProjectEndorsementComponent>,
//     @Inject(MAT_DIALOG_DATA) public data,
//     private projectEndorsementService: ProjectEndorsementService
//   ) {}
//   rating;
//   approverDescription;
//   ratingLoop = [];
//   ratingRequest = {
//     rating: '-1'
//   };

//   requestForm: FormGroup;
//   ngOnInit() {
//     this.ratingLoop = new Array(5);
//     this.ratingLoop.fill(1);
//   }
//   approveEndorsement() {
//     const obj = {
//       endorse_id: this.data.endorse_id,
//       status: 'approved',
//       rating: this.ratingRequest.rating,
//       approver_description: this.approverDescription
//     };
//     this.projectEndorsementService.endorseRequest(obj).subscribe(res => {
//       this.dialogRef.close('approved');
//     });
//   }
//   closeDialog() {
//     this.dialogRef.close();
//   }
// }

@Component({
  selector: 'app-view-project-endorsement',
  templateUrl: './view-project-endorsement.component.html',
  styleUrls: ['./view-project-endorsement.component.scss']
})
export class ViewProjectEndorsementComponent implements OnInit {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  endorsementDetails: mySkills.IProjectEndorsement;
  // loader: boolean = true;
  @Input() type: string;
  @Input() showHeader: boolean;
  rating = [0, 1, 2, 3, 4];
  statusPending = false;
  statusApproved = false;
  statusRejected = false;
  endorsement: boolean;
  constructor(
    private projectEndorsementService: ProjectEndorsementService,
    public dialog: MatDialog,
    private configSvc: ConfigService
  ) {}
  ngOnInit() {
    this.getList();
  }

  getList() {
    this.projectEndorsementService.getList(this.type).subscribe(res => {
      this.endorsementDetails = res;
      // this.endorsementDetails.pending_request.map(cur => {
      if (this.endorsementDetails.all_request.length === 0) {
        this.endorsement = false;
      } else {
        this.endorsement = true;
      }
      this.statusPending = true;
      // this.loader = false;
      // });
      // this.endorsementDetails['approved_request'].map(cur =>{
      //   this.statusApproved=true;
      // })
    });
  }

  openRejectDialog(request) {
    const dialogRef = this.dialog.open(DialogRejectRequestComponent, {
      data: request
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'rejected') {
        // this.loader = true;
        setTimeout(() => this.getList(), 1000);
      }
    });
  }

  openApproveDialog(request) {
    const dialogRef = this.dialog.open(DialogApproveRequestComponent, {
      data: request
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'approved') {
        // this.loader = true;
        setTimeout(() => this.getList(), 1000);
      }
    });
  }
}
