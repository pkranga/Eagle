/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardChannelV2Component } from './card-channel-v2.component'
import { MatCardModule, MatIconModule } from '@angular/material'
import { RouterModule } from '@angular/router'
import { PipeDurationTransformModule, DefaultThumbnailModule } from '@ws-widget/utils'

@NgModule({
  declarations: [CardChannelV2Component],
  imports: [
    CommonModule,
    RouterModule,
    PipeDurationTransformModule,
    DefaultThumbnailModule,
    // Material Imports
    MatCardModule,
    MatIconModule,
  ],
  exports: [CardChannelV2Component],
  entryComponents: [CardChannelV2Component],
})
export class CardChannelModuleV2 { }
