/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatToolbarModule } from '@angular/material'

import { BtnPageBackModule } from '@ws-widget/collection'

import { TrainingRoutingModule } from './training-routing.module'
import { HomeComponent } from './components/home/home.component'
import { TrainingTypeComponent } from './components/training-type/training-type.component'

@NgModule({
  declarations: [HomeComponent, TrainingTypeComponent],
  imports: [CommonModule, TrainingRoutingModule, MatToolbarModule, BtnPageBackModule],
  exports: [TrainingTypeComponent],
})
export class TrainingModule {}
