/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { MatDialog } from '@angular/material'
import { DialogSocialDeletePostComponent } from '../../dialog/dialog-social-delete-post/dialog-social-delete-post.component'

@Component({
  selector: 'ws-widget-btn-social-delete',
  templateUrl: './btn-social-delete.component.html',
  styleUrls: ['./btn-social-delete.component.scss'],
})
export class BtnSocialDeleteComponent implements OnInit {
  @Input() postId = ''
  @Output() deleteStatus = new EventEmitter<'success' | 'failure'>()
  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  confirmDelete() {
    const dialogRef = this.dialog.open(DialogSocialDeletePostComponent, {
      data: { postId: this.postId },
    })
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.deleteStatus.emit('success')
      } else {
        this.deleteStatus.emit('failure')
      }
    })
  }
}
