/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatRippleModule,
  MatSidenavModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatGridListModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatMenuModule,
  MatBadgeModule,
  MatDividerModule,
  MatSlideToggleModule
} from '@angular/material';
@NgModule({
  exports: [
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatSidenavModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    ScrollingModule,
    MatTooltipModule,
    MatGridListModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    MatSlideToggleModule
  ]
})
export class QandAMaterialModule {}
