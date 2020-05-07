/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from '../carousel/carousel.module';
import { BannerWithContentStripComponent } from './components/banner-with-content-strip/banner-with-content-strip.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchStripModule } from '../search-strip/search-strip.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BannerWithContentStripComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatTooltipModule,
    CarouselModule,
    SearchStripModule,
    RouterModule,
    CustomDirectivesModule
  ],

  exports: [BannerWithContentStripComponent]
})
export class BannerWithContentStripModule { }
