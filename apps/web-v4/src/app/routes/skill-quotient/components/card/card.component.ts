/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Inject, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { RouteDataService, SkillQuotientService } from '../../services';
import { ConfigService } from '../../../../services/config.service';
import * as mySkills from '../../../../models/my-skills.model';
import { DialogDeleteRoleComponent } from '../dialog-delete-role/dialog-delete-role.component';

/**
 * CODE_REVIEW
 * muliple components in one file
 * order of component
 */

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  @Input() skillQuotient: string;
  @Input() skillName: string;
  @Input() imageName;
  @Input() imageurl: string;
  @Input() rolesData: mySkills.IGetRoles[];
  @Input() roleCard: boolean;
  @Input() cardId: string;
  @Input() popular: boolean;
  @Input() courseCount: number;
  @Input() certificationCount: number;
  @Input() count: boolean;
  @Input() category: string;
  @Input() criticality: string;
  @Input() horizon: string;
  roleQuotientData: any;
  actionbutton: boolean;
  loader = true;
  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;

  @Output() deleteRoleEvent = new EventEmitter();

  constructor(
    private skillSvc: SkillQuotientService,
    private router: Router,
    public dialog: MatDialog,
    private routeData: RouteDataService,
    private snackBar: MatSnackBar,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.actionbutton = this.roleCard;
    this.loader = false;
  }
  onCardClick(cardId, skillName) {
    if (this.roleCard === true) {
      this.routeData.setStoredData('role_id', cardId);
      this.router.navigate(['/my-skills/my-roles'], {
        queryParams: { roleId: cardId }
      });
    } else {
      if (this.isSiemensInstance) {
        this.routeData.setStoredData('skill_id', cardId);
        this.router.navigate(['/my-skills/skill-quotient'], {
          queryParams: { skill: skillName }
        });
      } else {
        this.routeData.setStoredData('skill_id', cardId);
        this.router.navigate(['/my-skills/skills'], {
          queryParams: { skillId: cardId }
        });
      }
    }
  }

  onEditRole(roleId) {
    this.router.navigate(['/my-skills/edit-role'], {
      queryParams: { roleId }
    });
  }
  onShareRole(roleId) {
    this.router.navigate(['/my-skills/share-role'], {
      queryParams: { roleId }
    });
  }
  scoreDetails(roleId) {
    // console.log(roleId);
    this.router.navigate(['/my-skills/roles'], {
      queryParams: { roleId }
    });
  }
  openDialog(data): void {
    const dialogRef = this.dialog.open(DialogDeleteRoleComponent, { data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'deleted') {
        this.deleteRoleEvent.emit();
      }
    });
  }
}
// @Component({
//   selector: 'dialog-delete-role',
//   templateUrl: 'dialog-delete-role.html'
// })
// export class DialogDeleteRole {
//   constructor(
//     public dialogRef: MatDialogRef<DialogDeleteRole>,
//     @Inject(MAT_DIALOG_DATA) public data,
//     private skillSvc: SkillQuotientService,
//     private snackBar: MatSnackBar,
//     private router: Router
//   ) {}
//   deleteRole() {
//     this.skillSvc.deleteRole(this.data).subscribe(response => {
//       this.snackBar.open('Deleted Successfully', 'Close', { duration: 1500 });
//       setTimeout(() => {
//         this.skillSvc.getRoles().subscribe(res => {
//           if (res.length === 0) {
//             this.router.navigate(['/my-skills/add-role']);
//           }
//         });
//       }, 1000);

//       this.dialogRef.close();
//     });
//   }
//   onNoClick(): void {
//     this.dialogRef.close();
//   }
//   closeDialog() {
//     this.dialogRef.close();
//   }
// }
