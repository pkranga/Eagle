/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { IKhubItemTile } from '../../../infy/routes/knowledge-hub/models/knowledgeHub.model'

@Component({
  selector: 'ws-app-item-tile',
  templateUrl: './item-tile.component.html',
  styleUrls: ['./item-tile.component.scss'],
})
export class ItemTileComponent implements OnInit {
  @Input() data: IKhubItemTile = {} as IKhubItemTile
  ref = 'home'
  topics: string[] = []
  constructor(private activated: ActivatedRoute, private route: Router) { }

  ngOnInit() { }
  isString(input: any) {
    return typeof input === 'string'
  }
  goToView() {
    try {
      this.route.navigate(
        [`/app/infy/khub/view/${this.data.category}/${this.data.itemId}/${this.data.source}`],
        {
          relativeTo: this.activated.parent,
        },
      )
    } catch (e) {
      throw e
    }
  }
}
