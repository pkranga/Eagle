/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { Lab42RoutingModule } from './lab42-routing.module';
import { Lab42Component } from './components/lab42/lab42.component';
import { MatButtonModule } from '../../../../node_modules/@angular/material';

@NgModule({
  declarations: [Lab42Component],
  imports: [
    CommonModule,
    Lab42RoutingModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ]
})
export class Lab42Module { }
