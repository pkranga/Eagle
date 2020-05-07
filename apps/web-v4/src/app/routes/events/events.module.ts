/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// custom modules
import { EventsRoutingModule } from './events-routing.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule, MatSnackBarModule } from '@angular/material';

import { EventsComponent } from './components/events/events.component';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';

@NgModule({
  declarations: [EventsComponent],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SearchStripModule,
    CustomDirectivesModule,
    ContentStripModule,
    SpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatExpansionModule,
    MatSnackBarModule
  ],
  providers: []
})
export class EventsModule {}
