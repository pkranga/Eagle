/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// material imports
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatChipsModule,
  MatDividerModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';

// module imports
import { QAndARoutingModule } from './q-and-a-routing.module';
import { EditorQuillModule } from '../../modules/editor-quill/editor-quill.module';
import { SocialModule } from '../../modules/social/social.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { UtilityModule } from '../../modules/utility/utility.module';

import { QAndAComponent } from './components/q-and-a/q-and-a.component';
import { QnadaReplyViewComponent } from './components/qnada-reply-view/qnada-reply-view.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [QAndAComponent, SafeHtmlPipe, QnadaReplyViewComponent],
  imports: [
    CommonModule,
    QAndARoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatTabsModule,
    MatMenuModule,
    MatSnackBarModule,
    MatExpansionModule,
    UtilityModule,
    SocialModule,
    SpinnerModule,
    EditorQuillModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class QAndAModule {}
