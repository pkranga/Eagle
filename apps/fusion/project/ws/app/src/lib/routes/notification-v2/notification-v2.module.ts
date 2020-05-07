/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import {
  MatToolbarModule,
  MatDividerModule,
  MatButtonModule,
  MatRippleModule,
  MatIconModule,
} from '@angular/material'

import { BtnPageBackModule } from '@ws-widget/collection'

import { NotificationV2RoutingModule } from './notification-v2-routing.module'
import { HomeComponent } from './components/home/home.component'
import { NotificationService } from './services/notification.service'
import { NotificationApiService } from './services/notification-api.service'
import { NotificationEventComponent } from './components/notification-event/notification-event.component'

@NgModule({
  declarations: [HomeComponent, NotificationEventComponent],
  imports: [
    CommonModule,
    NotificationV2RoutingModule,
    MatToolbarModule,
    MatDividerModule,
    MatButtonModule,
    MatRippleModule,
    MatIconModule,
    BtnPageBackModule,
  ],
  providers: [NotificationApiService, NotificationService],
})
export class NotificationV2Module {}
