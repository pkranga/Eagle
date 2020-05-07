/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';
import {
  MatToolbarModule,
  MatTabsModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatButtonToggleModule,
  MatDividerModule
} from '@angular/material';
import { InfyTVRoutingModule } from './infy-tv-routing.module';
import { DetailHomeComponent } from './components/detail-home/detail-home.component';
import { BroadcastComponent } from './components/broadcast/broadcast.component';
import { ChannelComponent } from './components/channel/channel.component';
import { JustForYouComponent } from './components/just-for-you/just-for-you.component';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { BannerWithContentStripModule } from '../../modules/banner-with-content-strip/banner-with-content-strip.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';

// import { BannerWithContentStripsComponent } from "src/app/components/banner-with-content-strips/banner-with-content-strips.component";
@NgModule({
  declarations: [DetailHomeComponent, BroadcastComponent, ChannelComponent, JustForYouComponent],
  imports: [
    BannerWithContentStripModule,
    CommonModule,
    SearchStripModule,
    InfyTVRoutingModule,
    MatToolbarModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    ScrollHandlerModule,
    MatDividerModule,
    SpinnerModule
  ]
})
export class InfyTVModule {}
