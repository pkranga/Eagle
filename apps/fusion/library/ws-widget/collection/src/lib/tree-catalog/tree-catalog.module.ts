/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { TreeCatalogComponent } from './tree-catalog.component'
import { TreeModule } from '../tree/tree.module'
import { TreeCatalogMenuComponent } from './tree-catalog-menu/tree-catalog-menu.component'
import { MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatButtonModule } from '@angular/material'
import { TreeCatalogRoutePipe } from './tree-catalog-route.pipe'

@NgModule({
  declarations: [TreeCatalogComponent, TreeCatalogMenuComponent, TreeCatalogRoutePipe],
  imports: [
    CommonModule,
    RouterModule,
    TreeModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
  ],
  exports: [TreeCatalogComponent, TreeCatalogMenuComponent],
  entryComponents: [TreeCatalogComponent],
})
export class TreeCatalogModule { }
