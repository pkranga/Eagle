/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { NotFoundComponent } from './components/not-found/not-found.component';

import {MatCardModule} from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';

import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { UnauthorisedComponent } from './components/unauthorised/unauthorised.component';
import { ServiceUnavailableComponent } from './components/service-unavailable/service-unavailable.component';
import { InternalServerErrorComponent } from './components/internal-server-error/internal-server-error.component';
import { DisabledFeatureComponent } from './components/disabled-feature/disabled-feature.component';
import { UnavailableFeatureComponent } from './components/unavailable-feature/unavailable-feature.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ForbiddenComponent,
    UnauthorisedComponent,
    ServiceUnavailableComponent,
    InternalServerErrorComponent,
    DisabledFeatureComponent,
    UnavailableFeatureComponent
  ],
  imports: [
    CommonModule,
    ErrorRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ]
})
export class ErrorModule { }
