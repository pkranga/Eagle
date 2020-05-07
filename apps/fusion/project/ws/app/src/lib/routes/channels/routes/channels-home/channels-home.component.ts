/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { WidgetContentService, NsContent } from '@ws-widget/collection'
import { IFilterUnitContent } from '../../../search/models/search.model'

@Component({
  selector: 'ws-app-channels-home',
  templateUrl: './channels-home.component.html',
  styleUrls: ['./channels-home.component.scss'],
})
export class ChannelsHomeComponent implements OnInit {
  labelFilters: IFilterUnitContent[] = []
  categories: { [type: string]: NsContent.IContent[] } = {}
  constructor(private contentSvc: WidgetContentService) { }

  ngOnInit() {
    this.contentSvc.search({
    }).subscribe(response => {
      if (response.notToBeShownFilters) {
        const labels = response.notToBeShownFilters.find(unit => unit.type === 'labels')
        if (labels) {
          this.labelFilters = labels.content
        }
      }
    })
  }

  fetchChannel(label: IFilterUnitContent) {
    this.contentSvc.search({
      filters: {
        contentType: [NsContent.EContentTypes.CHANNEL],
        labels: label.type ? [label.type] : [],
      },
    }).subscribe(response => {
      this.categories[label.type || ''] = response.result
    })
  }

}
