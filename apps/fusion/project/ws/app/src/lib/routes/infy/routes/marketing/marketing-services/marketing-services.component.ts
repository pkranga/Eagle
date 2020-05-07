/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { IFilterUnitItem } from '../../../../search/models/search.model'
import { NsWidgetResolver } from '@ws-widget/resolver'

type TDisplayType = 'pentagon' | 'a2z'

@Component({
  selector: 'ws-app-marketing-services',
  templateUrl: './marketing-services.component.html',
  styleUrls: ['./marketing-services.component.scss'],
})
export class MarketingServicesComponent implements OnInit {

  pentagonFetchInProgress = true
  displayType: TDisplayType = 'pentagon'
  selectedPillar = ''
  pentagon: { [pillar: string]: IFilterUnitItem } | null = null
  widgetResolverData: NsWidgetResolver.IRenderConfigWithAnyData = {
    widgetData: {
      url: '/apis/protected/v8/catalog/tags',
      baseClickUrl: '/app/infy/marketing/offering',
      type: 'Pentagon',
      tags: 'Pentagon>Accelerate',
    },
    widgetType: 'tree',
    widgetSubType: 'treeCatalog',
  }

  constructor() { }

  ngOnInit() {

  }
  trackClicked(event: string) {
    this.selectedPillar = event
    const tags = `Pentagon>${event}`
    this.widgetResolverData = {
      ...this.widgetResolverData,
      widgetData: {
        ...this.widgetResolverData.widgetData,
        tags,
      },
    }
  }
}
