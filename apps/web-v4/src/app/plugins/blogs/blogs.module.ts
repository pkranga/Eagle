/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { BlogsRoutingModule } from './blogs-routing.module';
import { EditorQuillModule } from '../../modules/editor-quill/editor-quill.module';
import { SocialModule } from '../../modules/social/social.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { UtilityModule } from '../../modules/utility/utility.module';
// component imports
import { BlogReplyComponent } from './components/blog-reply/blog-reply.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';

@NgModule({
  declarations: [BlogsComponent, SafeHtmlPipe, BlogReplyComponent],
  imports: [
    CommonModule,
    BlogsRoutingModule,
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
    EditorQuillModule
  ]
})
export class BlogsModule {}
