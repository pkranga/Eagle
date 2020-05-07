/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbmsHandsOnComponent } from './components/dbms-hands-on/dbms-hands-on.component';
import { DbmsExerciseComponent } from './components/dbms-exercise/dbms-exercise.component';
import { AceEditorModule } from 'ng2-ace-editor';

// tslint:disable-next-line:max-line-length
import { MatCardModule, MatIconModule, MatProgressBarModule, MatButtonModule, MatInputModule, MatTabsModule, MatTableModule, MatSelectModule, MatSnackBar, MatSnackBarModule, MatListModule, MatDialogModule, MatExpansionModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DbmsConceptDropdownComponent } from './components/dbms-concept-dropdown/dbms-concept-dropdown.component';
import { DbmsConceptCreateComponent } from './components/dbms-concept-create/dbms-concept-create.component';
import { DbmsPlaygroundComponent } from './components/dbms-playground/dbms-playground.component';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { DbmsBestPracticeComponent } from './components/dbms-best-practice/dbms-best-practice.component';
import { SubmissionDialogComponent } from './components/submission-dialog/submission-dialog.component';
import { ExecutionResultComponent } from './components/execution-result/execution-result.component';

@NgModule({
  // tslint:disable-next-line:max-line-length
  declarations: [DbmsHandsOnComponent, DbmsExerciseComponent, DbmsConceptDropdownComponent, DbmsConceptCreateComponent, DbmsPlaygroundComponent, DbmsBestPracticeComponent, SubmissionDialogComponent, ExecutionResultComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AceEditorModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatListModule,
    MatDialogModule,
    MatSnackBarModule,
    MatExpansionModule,
    SpinnerModule
  ],
  entryComponents: [SubmissionDialogComponent],
  exports: [
    DbmsHandsOnComponent
  ]
})
export class RdbmsHandsonModule { }
