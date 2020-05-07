/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { WidgetResolverModule } from '@ws-widget/resolver'
import {
  MatButtonModule,
  MatDividerModule,
  MatToolbarModule,
  MatIconModule,
  MatChipsModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatMenuModule,
  MatInputModule,
} from '@angular/material'
import {
  BtnPageBackModule,
  EditorQuillModule,
  BtnSocialVoteModule,
  BtnSocialLikeModule,
  UserImageModule,
} from '@ws-widget/collection'
import { PipeLimitToModule, PipeSafeSanitizerModule } from '@ws-widget/utils'

import { QnaViewComponent } from './components/qna-view/qna-view.component'
import { QnaReplyComponent } from './components/qna-reply/qna-reply.component'

@NgModule({
  declarations: [QnaViewComponent, QnaReplyComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    WidgetResolverModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatDividerModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    BtnPageBackModule,
    BtnSocialVoteModule,
    BtnSocialLikeModule,
    EditorQuillModule,
    UserImageModule,
    PipeLimitToModule,
    PipeSafeSanitizerModule,
  ],
})
export class QnaViewModule { }
