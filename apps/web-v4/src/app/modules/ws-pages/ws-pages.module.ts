/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatNativeDateModule, MatTabsModule, MatToolbarModule } from '@angular/material';
import { ContentStripModule } from '../content-strip/content-strip.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { CarouselModule } from '../carousel/carousel.module';
import { ScrollHandlerModule } from '../scroll-handler/scroll-handler.module';
import { SearchStripModule } from '../search-strip/search-strip.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { UtilityModule } from '../utility/utility.module';
import { WsPagesComponent } from './components/ws-pages/ws-pages.component';
import { GridLayoutComponent } from './layouts/grid-layout/grid-layout.component';
import { WidgetResolverComponent } from './widgets/widget-resolver/widget-resolver.component';

@NgModule({
  declarations: [
    WsPagesComponent,
    GridLayoutComponent,
    WidgetResolverComponent,
  ],
  exports: [WsPagesComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatTabsModule,
    MatToolbarModule,
    ContentStripModule,
    CustomDirectivesModule,
    CarouselModule,
    ScrollHandlerModule,
    SearchStripModule,
    SpinnerModule,
    UtilityModule
  ]
})
export class WsPagesModule { }
