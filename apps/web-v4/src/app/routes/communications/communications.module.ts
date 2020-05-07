/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommunicationsRoutingModule } from './communications-routing.module';
import { CarouselModule } from '../../modules/carousel/carousel.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';

import { RadioComponent } from './components/radio/radio.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';

@NgModule({
  declarations: [RadioComponent],
  imports: [
    CommonModule,
    CommunicationsRoutingModule,
    CustomDirectivesModule,
    CarouselModule,
    SpinnerModule,
    ContentStripModule,
    SearchStripModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class CommunicationsModule {}
