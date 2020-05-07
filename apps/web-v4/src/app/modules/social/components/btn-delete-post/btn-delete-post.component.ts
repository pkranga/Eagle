/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogDeletePostComponent } from '../dialog-delete-post/dialog-delete-post.component';

@Component({
  selector: 'app-btn-delete-post',
  templateUrl: './btn-delete-post.component.html',
  styleUrls: ['./btn-delete-post.component.scss']
})
export class BtnDeletePostComponent implements OnInit {
  @Input() postId: string;
  @Output() deleteStatus = new EventEmitter<'success' | 'failure'>();
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  confirmDelete() {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      data: { postId: this.postId }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.deleteStatus.emit('success');
      } else {
        this.deleteStatus.emit('failure');
      }
    });
  }
}
