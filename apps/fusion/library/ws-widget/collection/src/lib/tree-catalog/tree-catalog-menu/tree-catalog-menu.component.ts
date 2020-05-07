/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, ViewChild, ElementRef, Input } from '@angular/core'
import { TFetchStatus } from '@ws-widget/utils'
import { MatMenuTrigger } from '@angular/material'
import { NSSearch } from '../../_services/widget-search.model'

@Component({
  selector: 'ws-widget-tree-catalog-menu',
  templateUrl: './tree-catalog-menu.component.html',
  styleUrls: ['./tree-catalog-menu.component.scss'],
})
export class TreeCatalogMenuComponent {

  @ViewChild('childMenu', { static: true }) public childMenu!: ElementRef

  @Input() rootTrigger: MatMenuTrigger | null = null
  @Input() catalogItems: NSSearch.IFilterUnitContent[] | null = null
  @Input() fetchStatus: TFetchStatus = 'none'
  @Input() isRoot = false

}
