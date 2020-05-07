/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CertificationRoutingModule } from './certification-routing.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { CardsModule } from '../../modules/cards/cards.module';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';

import { CertificationComponent } from './components/certification/certification.component';
import { CertificationApiService } from '../../apis/certification-api.service';
import { CertificationService } from '../../services/certification.service';

@NgModule({
  declarations: [CertificationComponent],
  imports: [
    CommonModule,
    CertificationRoutingModule,
    ContentStripModule,
    CustomDirectivesModule,
    CardsModule,
    SpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [CertificationService, CertificationApiService]
})
export class CertificationModule {}
