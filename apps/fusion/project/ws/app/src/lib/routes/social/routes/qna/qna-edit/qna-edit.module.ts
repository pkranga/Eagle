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
} from '@angular/material'
import { BtnPageBackModule, EditorQuillModule } from '@ws-widget/collection'
import { QnaEditComponent } from './components/qna-edit/qna-edit.component'

@NgModule({
  declarations: [QnaEditComponent],
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
    MatAutocompleteModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    BtnPageBackModule,
    EditorQuillModule,
  ],
})
export class QnaEditModule { }
