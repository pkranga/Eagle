/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { SharedModule } from '@ws/author/src/lib/modules/shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CreateComponent } from './components/create/create.component'
import { EntityCardComponent } from './components/entity-card/entity-card.component'
import { RouterModule } from '@angular/router'
import { CreateService } from './components/create/create.service'

@NgModule({
  declarations: [
    CreateComponent,
    EntityCardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
  ],
  providers: [CreateService],
})

export class CreateModule { }
