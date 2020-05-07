/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ISocialSearchResultData } from '../../../../models/social.model';
import { DialogDeletePostComponent } from '../../../../modules/social/components/dialog-delete-post/dialog-delete-post.component';
import { MatDialog, MatSnackBar } from '@angular/material';

@Component({
  selector: 'ws-qanda-card',
  templateUrl: './qanda-card.component.html',
  styleUrls: ['./qanda-card.component.scss']
})
export class QandaCardComponent implements OnInit {
  @Input() userId: string;
  @Input() item: ISocialSearchResultData;
  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {}

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
