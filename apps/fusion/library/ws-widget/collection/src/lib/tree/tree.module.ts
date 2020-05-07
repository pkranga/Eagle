/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { TreeComponent } from './tree.component'
import { MatCardModule, MatTreeModule, MatIconModule, MatButtonModule } from '@angular/material'
import { RouterModule } from '@angular/router'

@NgModule({
  declarations: [TreeComponent],
  imports: [
    CommonModule,
    RouterModule,

    // Material Imports
    MatCardModule,
    MatTreeModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [TreeComponent],
  entryComponents: [TreeComponent],
})
export class TreeModule { }
