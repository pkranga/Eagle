/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MarketingComponent } from './marketing.component'
import { MarketingRoutingModule } from './marketing-routing.module'
import { MarketingServicesModule } from './marketing-services/marketing-services.module'
import {
  MatToolbarModule,
  MatIconModule,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
} from '@angular/material'
import { PageModule, BtnPageBackModule } from '@ws-widget/collection'

@NgModule({
  declarations: [MarketingComponent],
  imports: [
    CommonModule,
    MarketingRoutingModule,
    MarketingServicesModule,
    PageModule,
    BtnPageBackModule,

    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
  ],
})
export class MarketingModule { }
