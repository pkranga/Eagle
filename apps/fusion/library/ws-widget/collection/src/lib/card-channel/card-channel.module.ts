/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardChannelComponent } from './card-channel.component'
import { MatCardModule, MatIconModule } from '@angular/material'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [CardChannelComponent],
  imports: [
    CommonModule,
    RouterModule,

    // Material Imports
    MatCardModule,
    MatIconModule,
  ],
  exports: [CardChannelComponent],
  entryComponents: [CardChannelComponent],
})
export class CardChannelModule { }
