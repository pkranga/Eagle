/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemTile } from '../../../../models/khub.model';
import { KhubService } from '../../../../services/khub.service';

@Component({
  selector: 'app-item-tile',
  templateUrl: './item-tile.component.html',
  styleUrls: ['./item-tile.component.scss']
})
export class ItemTileComponent implements OnInit, OnChanges {
  @Input() show: boolean;
  @Input() data: ItemTile;
  @Input() mobile: MediaQueryList;
  @Input() ref: any;
  public view = false;
  public topics: string[];
  constructor(private router: Router, private khubServ: KhubService) {}

  ngOnInit() {
    if (this.data.topics.length > 0 && typeof this.data.topics === 'string') {
      this.topics = this.data.topics;
    } else {
      this.topics = this.data.topics;
    }
  }

  ngOnChanges() {
    this.view = this.show;
  }

  isString(input: any) {
    return typeof input === 'string';
  }

  gotoView() {
    try {
      // this.router.navigate(['/view'], { queryParams: { url: this.data.url});
      // const response = this.khubServ.setSelectedItem(this.data);
      if (this.data.itemType !== '') {
        this.router.navigate(['/khub/view/' + this.data.itemId]);
      } else {
        this.router.navigate(['/viewer/' + this.data.itemId]);
      }
    } catch (e) {
      throw e;
    }
  }
}
