/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { DragDropModule } from '@angular/cdk/drag-drop'
import { ScrollingModule } from '@angular/cdk/scrolling'

import { PipeDurationTransformModule } from '@ws-widget/utils'

import { ClassDiagramComponent } from './class-diagram.component'
import { ClassDiagramResultComponent } from './components/class-diagram-result/class-diagram-result.component'

import {
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatButtonModule,
  MatTableModule,
  MatDialogModule,
  MatSelectModule,
} from '@angular/material'

@NgModule({
  declarations: [ClassDiagramComponent, ClassDiagramResultComponent],
  imports: [
    CommonModule,
    FormsModule,
    ScrollingModule,
    DragDropModule,
    PipeDurationTransformModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    MatTableModule,
  ],
  exports: [
    ClassDiagramComponent,
  ],
})
export class ClassDiagramModule { }
