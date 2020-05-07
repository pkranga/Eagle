/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { MarketingRoutingModule } from './marketing-routing.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';

import {
  MatTabsModule,
  MatTreeModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatListModule
} from '@angular/material';

import { MarketingComponent } from './components/marketing/marketing.component';
import { PentagonModule } from '../../modules/pentagon/pentagon.module';
import { ServicesComponent } from './components/services/services.component';
import { IndustriesComponent } from './components/industries/industries.component';
import { ProductsComponent } from './components/products/products.component';
import { OfferingComponent } from './components/offering/offering.component';
import { HubsComponent } from './components/hubs/hubs.component';
import { LivingLabsModule } from '../living-labs/living-labs.module';
import { ExperienceComponent } from './components/experience/experience.component';

@NgModule({
  declarations: [
    MarketingComponent,
    ServicesComponent,
    IndustriesComponent,
    ProductsComponent,
    OfferingComponent,
    HubsComponent,
    ExperienceComponent
  ],
  imports: [
    CommonModule,
    MarketingRoutingModule,
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    MatToolbarModule,
    MatListModule,
    MatTreeModule,
    MatButtonModule,
    SearchStripModule,
    PentagonModule,
    LivingLabsModule,
    SpinnerModule
  ]
})
export class MarketingModule {}
