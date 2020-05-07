/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SpinnerModule } from '../spinner/spinner.module';
import { UtilityModule } from '../utility/utility.module';

// material
import {
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatDialogModule,
  MatSnackBarModule,
  MatTabsModule,
  MatDividerModule
} from '@angular/material';

import { BtnDeletePostComponent } from './components/btn-delete-post/btn-delete-post.component';
import { BtnLikeComponent } from './components/btn-like/btn-like.component';
import { BtnVoteComponent } from './components/btn-vote/btn-vote.component';
import { DialogDeletePostComponent } from './components/dialog-delete-post/dialog-delete-post.component';
import { DialogActivityUsersComponent } from './components/dialog-activity-users/dialog-activity-users.component';

@NgModule({
  declarations: [
    BtnDeletePostComponent,
    BtnLikeComponent,
    BtnVoteComponent,
    DialogDeletePostComponent,
    DialogActivityUsersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatDividerModule,

    SpinnerModule,
    UtilityModule
  ],
  exports: [BtnDeletePostComponent, BtnLikeComponent, BtnVoteComponent],
  entryComponents: [DialogDeletePostComponent, DialogActivityUsersComponent]
})
export class SocialModule {}
