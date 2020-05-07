/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizComponent } from './components/quiz/quiz.component';
import { QuestionComponent } from './components/question/question.component';
import { OverviewComponent } from './components/overview/overview.component';
import {
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatRadioModule,
  MatChipsModule,
  MatSidenavModule,
  MatGridListModule,
  MatIconModule,
  MatDialogModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TimeConverterPipe } from './pipes/time-converter.pipe';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { SubmitQuizDialogComponent } from './components/submit-quiz-dialog/submit-quiz-dialog.component';
@NgModule({
  declarations: [
    QuizComponent,
    QuestionComponent,
    OverviewComponent,
    SubmitQuizDialogComponent,
    TimeConverterPipe
  ],
  entryComponents: [SubmitQuizDialogComponent],
  imports: [
    CommonModule,
    QuizRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule,
    MatSidenavModule,
    MatGridListModule,
    MatListModule,
    MatRadioModule,
    MatIconModule,
    MatChipsModule,
    SpinnerModule,
    MatTableModule,
    UtilityModule
  ]
})
export class QuizModule {}
