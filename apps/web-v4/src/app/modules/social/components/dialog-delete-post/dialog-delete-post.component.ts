/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SocialService } from '../../../../services/social.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dialog-delete-post',
  templateUrl: './dialog-delete-post.component.html',
  styleUrls: ['./dialog-delete-post.component.scss']
})
export class DialogDeletePostComponent implements OnInit {
  isDeleting = false;
  errorInDeleting = false;
  constructor(
    public dialogRef: MatDialogRef<DialogDeletePostComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { postId: string },
    private socialSvc: SocialService,
    private authSvc: AuthService
  ) {}

  ngOnInit() {}

  deletePost(): void {
    this.isDeleting = true;
    this.socialSvc.deletePost(this.data.postId, this.authSvc.userId).subscribe(
      _ => {
        this.isDeleting = false;
        this.dialogRef.close(true);
      },
      () => {
        this.isDeleting = false;
        this.errorInDeleting = true;
      }
    );
  }
}
