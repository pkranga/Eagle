/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmtRoutingModule } from './cmt-routing.module';
import { CarouselModule } from '../../modules/carousel/carousel.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import {
  MatTabsModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatListModule
} from '@angular/material';

import { CmtComponent } from './components/cmt/cmt.component';

@NgModule({
  declarations: [CmtComponent],
  imports: [
    ScrollHandlerModule,
    CommonModule,
    CmtRoutingModule,
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
export class CmtModule { }
