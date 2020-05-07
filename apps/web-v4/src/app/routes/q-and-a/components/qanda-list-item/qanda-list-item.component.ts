/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ITimelineResult } from '../../../../models/social.model';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogDeletePostComponent } from '../../../../modules/social/components/dialog-delete-post/dialog-delete-post.component';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-qanda-list-item',
  templateUrl: './qanda-list-item.component.html',
  styleUrls: ['./qanda-list-item.component.scss']
})
export class QandaListItemComponent implements OnInit {
  @Input() item: ITimelineResult;
  userId = this.authSvc.userId;
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authSvc: AuthService
  ) {}

  ngOnInit() {}

  deletePost(successMsg: string) {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      data: { postId: this.item.id }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.snackBar.open(successMsg);
        this.item.status = 'Inactive';
      }
    });
  }
}
