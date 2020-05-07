/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { CarouselModule } from '../../modules/carousel/carousel.module';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';

import { HomeComponent } from './components/home/home.component';
import { ContentWidgetsModule } from '../../modules/content-widgets/content-widgets.module';
// user custom modules
import { HomeRoutingModule } from './home-routing.module';

@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    CarouselModule,
    CustomDirectivesModule,
    ScrollHandlerModule,
    ContentStripModule,
    SearchStripModule,
    SpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatToolbarModule,
    MatDividerModule,
    MatTooltipModule,
    MatMenuModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    ContentWidgetsModule
  ]
})
export class HomeModule { }
