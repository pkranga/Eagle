/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from '../../modules/carousel/carousel.module';
import { IkiRoutingModule } from './iki-routing.module';
import { IkiHomeComponent } from './components/iki-home/iki-home.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';
import {
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatCheckboxModule,
  MatListModule,
  MatTabsModule
} from '@angular/material';
@NgModule({
  declarations: [IkiHomeComponent],
  imports: [
    CommonModule,
    IkiRoutingModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    CarouselModule,
    CustomDirectivesModule,
    SearchStripModule
  ]
})
export class IkiModule {}
