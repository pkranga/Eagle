/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// component imports
import { HandsOnComponent } from './components/hands-on/hands-on.component';
import { ExerciseContainerComponent } from './components/exercise-container/exercise-container.component';
import { ExecutionResultComponent } from './components/execution-result/execution-result.component';

// pipe imports
import { TimeConverterPipe } from './pipes/time-converter.pipe';

// module imports
import { HandsOnRoutingModule } from './hands-on-routing.module';
import { AceEditorModule } from 'ng2-ace-editor';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { ProgressSpinnerModule } from '../../modules/progress-spinner/progress-spinner.module';
import { CompletionSpinnerModule } from '../../modules/completion-spinner/completion-spinner.module';

import {
  MatCardModule,
  MatIconModule,
  MatProgressBarModule,
  MatButtonModule
} from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    HandsOnComponent,
    ExerciseContainerComponent,
    TimeConverterPipe,
    ExecutionResultComponent
  ],
  entryComponents: [ExecutionResultComponent],
  imports: [
    CommonModule,
    HandsOnRoutingModule,
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatButtonModule,
    MatDialogModule,
    AceEditorModule,
    SpinnerModule,
    UtilityModule,
    ProgressSpinnerModule,
    CompletionSpinnerModule
  ]
})
export class HandsOnModule {}
