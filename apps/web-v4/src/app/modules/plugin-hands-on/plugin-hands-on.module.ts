/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseContainerComponent } from './components/exercise-container/exercise-container.component';
import { TimeConverterPipe } from './pipes/time-converter.pipe';
import { AceEditorModule } from 'ng2-ace-editor';
import { MatCardModule, MatIconModule, MatProgressBarModule, MatButtonModule } from '@angular/material';
import { ExecutionResultComponent } from './components/execution-result/execution-result.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SpinnerModule } from '../spinner/spinner.module';
import { UtilityModule } from '../utility/utility.module';
import { ProgressSpinnerModule } from '../progress-spinner/progress-spinner.module';
import { CompletionSpinnerModule } from '../completion-spinner/completion-spinner.module';
@NgModule({
  declarations: [ExerciseContainerComponent, TimeConverterPipe, ExecutionResultComponent],
  imports: [
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
  ],
  entryComponents: [ ExecutionResultComponent ],
  exports: [
    ExerciseContainerComponent
  ]
})
export class PluginHandsOnModule { }
