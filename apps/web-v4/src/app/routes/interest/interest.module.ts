/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InterestRoutingModule } from './interest-routing.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { UtilityModule } from '../../modules/utility/utility.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { InterestComponent } from './components/interest/interest.component';

@NgModule({
  declarations: [InterestComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InterestRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,

    SpinnerModule,
    UtilityModule
  ]
})
export class InterestModule {}
