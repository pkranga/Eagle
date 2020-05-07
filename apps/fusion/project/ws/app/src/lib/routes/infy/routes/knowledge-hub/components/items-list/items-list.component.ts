/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IItemsList } from '../../models/knowledgeHub.model'
@Component({
  selector: 'ws-app-infy-item-list',
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {
  @Input() item: IItemsList = {} as IItemsList
  showMoreLess = {
    initial: true,
    text: 'Show More...',
    limit: 0,
  }
  constructor() {}

  ngOnInit() {
    this.showMoreLess.limit = this.item.itemsMinShown
  }
  changeItemShow() {
    try {
      this.showMoreLess.initial = !this.showMoreLess.initial
      this.showMoreLess.text = this.showMoreLess.initial ? 'Show More...' : 'Show Less'
      this.showMoreLess.limit = this.showMoreLess.initial
        ? this.item.itemsMinShown
        : this.item.data.length
    } catch (e) {
      throw e
    }
  }
}
