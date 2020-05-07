/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatSliderModule,
} from '@angular/material'
import { ImageCropperModule } from 'ngx-image-cropper'
import { ImageCropComponent } from './image-crop.component'

@NgModule({
  declarations: [ImageCropComponent],
  imports: [
    CommonModule,
    ImageCropperModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatDialogModule,
    MatCardModule,
    MatTooltipModule,
    MatSliderModule,
  ],
  exports: [ImageCropComponent],
  entryComponents: [ImageCropComponent],
})
export class ImageCropModule { }
