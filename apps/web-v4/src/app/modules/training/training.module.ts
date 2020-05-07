/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  MatCardModule,
  MatChipsModule,
  MatTabsModule,
  MatSelectModule,
  MatDatepickerModule,
  MatButtonToggleModule,
  MatIconModule,
  MatMenuModule,
  MatInputModule,
  MatButtonModule,
  MatNativeDateModule,
  MatTooltipModule,
  MatCheckboxModule,
  MatProgressBarModule,
  MatFormFieldModule,
  MatSlideToggleModule,
  MatAutocompleteModule
} from '@angular/material';

import { TrainingComponent } from './components/training/training.component';
import { NominateDialogComponent } from './components/nominate-dialog/nominate-dialog.component';
import { JitRequestComponent } from './components/jit-request/jit-request.component';
import { BtnWatchlistComponent } from './components/btn-watchlist/btn-watchlist.component';
import { TrainingShareDialogComponent } from './components/training-share-dialog/training-share-dialog.component';
import { SpinnerModule } from '../spinner/spinner.module';
import { TrainingFilterDialogComponent } from './components/training-filter-dialog/training-filter-dialog.component';
import { UtilityModule } from '../utility/utility.module';

@NgModule({
  declarations: [
    TrainingComponent,
    NominateDialogComponent,
    JitRequestComponent,
    BtnWatchlistComponent,
    TrainingShareDialogComponent,
    TrainingFilterDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatCardModule,
    MatChipsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressBarModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    SpinnerModule,
    UtilityModule
  ],
  exports: [TrainingComponent, BtnWatchlistComponent, JitRequestComponent],
  providers: [MatDatepickerModule],
  entryComponents: [NominateDialogComponent, TrainingShareDialogComponent, TrainingFilterDialogComponent]
})
export class TrainingModule {}
