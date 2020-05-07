/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input } from '@angular/core'
import { TreeCatalogService } from '../tree-catalog/tree-catalog.service'
import { TFetchStatus } from '@ws-widget/utils'
import { NSSearch } from '../_services/widget-search.model'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'

@Component({
  selector: 'ws-widget-btn-catalog',
  templateUrl: './btn-catalog.component.html',
  styleUrls: ['./btn-catalog.component.scss'],
})
export class BtnCatalogComponent extends WidgetBaseComponent
  implements NsWidgetResolver.IWidgetData<any> {

  @Input() widgetData!: any
  catalogItems: NSSearch.IFilterUnitContent[] | null = null
  catalogFetchStatus: TFetchStatus = 'none'

  constructor(private catalogSvc: TreeCatalogService) {
    super()
  }

  getCatalog() {
    this.catalogFetchStatus = 'fetching'
    this.catalogSvc.getFullCatalog().subscribe(
      (catalog: NSSearch.IFilterUnitContent[]) => {
        this.catalogFetchStatus = 'done'
        if (catalog.length === 1 && catalog[0].children) {
          this.catalogItems = catalog[0].children
        } else {
          this.catalogItems = catalog
        }
      },
      () => this.catalogFetchStatus = 'error',
    )
  }

}
