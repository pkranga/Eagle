/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileAppsRoutingModule } from './mobile-apps-routing.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatCardModule } from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';

import { MobileAppsComponent } from './components/mobile-apps/mobile-apps.component';

@NgModule({
  declarations: [MobileAppsComponent],
  imports: [
    CommonModule,
    MobileAppsRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatCardModule
  ]
})
export class MobileAppsModule {}
