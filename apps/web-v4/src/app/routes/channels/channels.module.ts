/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChannelsRoutingModule } from './channels-routing.module';
import { ChannelsHomeComponent } from './components/channels-home/channels-home.component';
import { ChannelContainerComponent } from './components/channel-container/channel-container.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTabsModule } from "@angular/material/tabs";
import { LeadershipModule } from '../../routes/leadership/leadership.module';
@NgModule({
  declarations: [ChannelsHomeComponent, ChannelContainerComponent],
  imports: [
    CommonModule,
    ChannelsRoutingModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    LeadershipModule,
  ],
  exports: [
    ChannelContainerComponent
  ]
})
export class ChannelsModule { }
