/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SharedModule } from '@ws/author/src/lib/modules/shared/shared.module'
import { EditorSharedModule } from '../../../shared/shared.module'
import { KnowledgeBoardRoutingModule } from './knowledge-borad-routing.module'
import { KnowledgeBoardComponent } from './components/knowledge-board/knowledge-board.component'

@NgModule({
  declarations: [
    KnowledgeBoardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EditorSharedModule,
    KnowledgeBoardRoutingModule,
  ],
})
export class KnowledgeBoardModule { }
