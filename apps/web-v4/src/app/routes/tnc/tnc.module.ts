/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';

import { TncRoutingModule } from './tnc-routing.module';
import { TncComponent } from './components/tnc/tnc.component';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { ContestRulesComponent } from './components/contest-rules/contest-rules.component';

@NgModule({
  declarations: [TncComponent, ContestRulesComponent],
  imports: [
    CommonModule,
    FormsModule,
    TncRoutingModule,
    SpinnerModule,

    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatRadioModule,
    MatCardModule,
    MatToolbarModule
  ]
})
export class TncModule {}
