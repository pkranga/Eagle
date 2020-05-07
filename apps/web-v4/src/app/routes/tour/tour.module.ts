/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TourRoutingModule } from './tour-routing.module';
import { ElementFullscreenModule } from '../../modules/element-fullscreen/element-fullscreen.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';

import { TourComponent } from './components/tour/tour.component';

@NgModule({
  declarations: [TourComponent],
  imports: [
    CommonModule,
    TourRoutingModule,
    ElementFullscreenModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class TourModule {}
