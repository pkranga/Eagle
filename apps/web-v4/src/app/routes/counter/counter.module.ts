/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CounterRoutingModule } from './counter-routing.module';
import { MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule } from '@angular/material';

import { PlatformCounterComponent } from './components/platform-counter/platform-counter.component';
import { CounterEntityComponent } from './components/counter-entity/counter-entity.component';
import { InfymeCounterComponent } from './components/infyme-counter/infyme-counter.component';

@NgModule({
  declarations: [PlatformCounterComponent, CounterEntityComponent, InfymeCounterComponent],
  imports: [CommonModule, CounterRoutingModule, MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule]
})
export class CounterModule {}
