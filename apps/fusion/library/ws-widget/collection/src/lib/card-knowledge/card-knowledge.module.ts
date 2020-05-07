/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CardKnowledgeComponent } from './card-knowledge.component'
import { RouterModule } from '@angular/router'
import { MatCardModule, MatIconModule, MatButtonModule, MatChipsModule } from '@angular/material'
import { DefaultThumbnailModule, PipeDurationTransformModule } from '@ws-widget/utils'
import { BtnContentShareModule } from '../btn-content-share/btn-content-share.module'
import { BtnFollowModule } from '../btn-follow/btn-follow.module'

@NgModule({
  declarations: [CardKnowledgeComponent],
  imports: [
    CommonModule,
    RouterModule,
    DefaultThumbnailModule,
    BtnFollowModule,
    BtnContentShareModule,

    // Material Imports
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    PipeDurationTransformModule,
  ],
  exports: [CardKnowledgeComponent],
  entryComponents: [CardKnowledgeComponent],

})
export class CardKnowledgeModule { }
