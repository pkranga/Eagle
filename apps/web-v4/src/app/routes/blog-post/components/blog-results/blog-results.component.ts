/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import {
  ITimelineRequestPartial,
  ITimeline
} from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';

import { DialogDeletePostComponent } from '../../../../modules/social/components/dialog-delete-post/dialog-delete-post.component';

import { AuthService } from '../../../../services/auth.service';
import { SocialService } from '../../../../services/social.service';

@Component({
  selector: 'app-blog-results',
  templateUrl: './blog-results.component.html',
  styleUrls: ['./blog-results.component.scss']
})
export class BlogResultsComponent implements OnInit {
  @Input() postRequest: ITimelineRequestPartial;
  @Input() blogMode: 'view' | 'edit' = 'view';

  requestBody: ITimelineRequestPartial;
  blogResult: ITimeline = {
    hits: 0,
    result: []
  };
  postFetchStatus: FetchStatus;
  userId: string;
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private socialSvc: SocialService,
    private authSvc: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.authSvc.userId;
    if (this.postRequest) {
      this.requestBody = { ...this.postRequest };
      this.fetchTimelineData();
    }
  }

  fetchTimelineData() {
    if (this.postFetchStatus === 'done') {
      return;
    }
    this.postFetchStatus = 'fetching';
    this.requestBody.pgNo += 1;
    this.socialSvc.fetchTimelineData(this.requestBody).subscribe(
      data => {
        if (data.hits && data.result) {
          this.blogResult.hits = data.hits;
          this.blogResult.result = [...this.blogResult.result, ...data.result];
          if (data.hits > this.blogResult.result.length) {
            this.postFetchStatus = 'hasMore';
          } else {
            this.postFetchStatus = 'done';
          }
        } else {
          this.postFetchStatus = 'none';
        }
      },
      err => {
        this.postFetchStatus = 'error';
      }
    );
  }

  deleteBlog(blogId: string, successMsg: string) {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      data: { postId: blogId }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.blogResult = {
          hits: this.blogResult.hits - 1,
          result: this.blogResult.result.filter(blog => blog.id !== blogId)
        };
        this.snackBar.open(successMsg);
      }
    });
  }
}
