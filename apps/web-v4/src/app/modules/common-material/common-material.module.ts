/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatButtonModule,
  MatIconModule,
  MatDialogModule,
  MatToolbarModule,
  MatFormFieldModule,
  MatCardModule,
  MatMenuModule,
  MatDividerModule,
  MatExpansionModule,
  MatSelectModule,
  MatProgressBarModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatInputModule,
  MatRippleModule,
  MatSnackBarModule
} from '@angular/material';

const modulesToExport = [
  // LayoutModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatMenuModule,
  MatProgressBarModule,
  MatRippleModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatToolbarModule
];

@NgModule({
  declarations: [],
  imports: [CommonModule, ...modulesToExport],
  exports: [...modulesToExport]
})
export class CommonMaterialModule {}
