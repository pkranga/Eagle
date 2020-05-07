/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatToolbarModule,
  MatTooltipModule,
  MatChipsModule,
  MatMenuModule,
  MatTabsModule,
  MatInputModule,
  MatDialogModule,
  MatDividerModule,
  MatSidenavModule,
  MatExpansionModule,
  MatListModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatOptionModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  exports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
    MatChipsModule,
    MatMenuModule,
    MatTabsModule,
    MatInputModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatSidenavModule,
    MatExpansionModule,
    MatListModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatOptionModule
  ]
})
export class KhubMaterialModule {}
