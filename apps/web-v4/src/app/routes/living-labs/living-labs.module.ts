/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LivingLabsRoutingModule } from './living-labs-routing.module';
import { LivingLabsComponent } from './components/living-labs/living-labs.component';
import {
  MatIconModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule
} from '@angular/material';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';
import { DummyContentCardComponent } from './components/dummy-content-card/dummy-content-card.component';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { CardsModule } from '../../modules/cards/cards.module';

@NgModule({
  declarations: [LivingLabsComponent, DummyContentCardComponent],
  imports: [
    CommonModule,
    LivingLabsRoutingModule,
    CustomDirectivesModule,
    SearchStripModule,
    ContentStripModule,
    ScrollHandlerModule,
    CardsModule,
    // Material Imports
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule
  ],
  exports: [LivingLabsComponent]
})
export class LivingLabsModule { }
