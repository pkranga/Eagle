/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

// component imports
import { ClassDiagramComponent } from './components/class-diagram/class-diagram.component';
import { ClassDiagramResultComponent } from './components/class-diagram-result/class-diagram-result.component';

// module imports
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { ClassDiagramRoutingModule } from './class-diagram-routing.module';

// pipe imports
import { TimeConverterPipe } from './pipes/time-converter.pipe';

// material imports
import {
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatButtonModule,
  MatTableModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    ClassDiagramComponent,
    TimeConverterPipe,
    ClassDiagramResultComponent
  ],
  imports: [
    CommonModule,
    ClassDiagramRoutingModule,
    FormsModule,
    ScrollingModule,
    DragDropModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    MatSelectModule,
    SpinnerModule,
    MatTableModule
  ],
  exports: [ClassDiagramComponent]
})
export class ClassDiagramModule {}
