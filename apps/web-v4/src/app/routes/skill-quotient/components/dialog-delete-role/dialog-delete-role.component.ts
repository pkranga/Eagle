/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { RouteDataService, SkillQuotientService } from '../../services';
import { ConfigService } from '../../../../services/config.service';
import * as mySkills from '../../../../models/my-skills.model';
@Component({
  selector: 'ws-dialog-delete-role',
  templateUrl: './dialog-delete-role.component.html',
  styleUrls: ['./dialog-delete-role.component.scss']
})
export class DialogDeleteRoleComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogDeleteRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private skillSvc: SkillQuotientService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
  }
  deleteRole() {
    this.skillSvc.deleteRole(this.data).subscribe(response => {
      this.snackBar.open('Deleted Successfully', 'Close', { duration: 1500 });
      setTimeout(() => {
        this.skillSvc.getRoles().subscribe(res => {
          if (res.length === 0) {
            this.router.navigate(['/my-skills/add-role']);
          }
        });
      }, 1000);

      this.dialogRef.close();
    });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
