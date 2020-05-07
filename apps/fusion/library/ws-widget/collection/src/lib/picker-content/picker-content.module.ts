/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTabsModule,
} from '@angular/material'
import { MatRadioModule } from '@angular/material/radio'
import { DefaultThumbnailModule, PipeDurationTransformModule } from '@ws-widget/utils'
import { DisplayContentTypeModule } from '../_common/display-content-type/display-content-type.module'
import { PickerContentComponent } from './picker-content.component'

@NgModule({
  declarations: [PickerContentComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DefaultThumbnailModule,
    PipeDurationTransformModule,
    // material modules
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    DisplayContentTypeModule,
    MatSelectModule,
    MatTabsModule,
    MatRadioModule,
  ],
  exports: [PickerContentComponent],
})
export class PickerContentModule {}
