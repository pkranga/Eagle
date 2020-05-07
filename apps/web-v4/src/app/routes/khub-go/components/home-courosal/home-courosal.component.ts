/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { KhubService } from '../../../../services/khub.service';
import { ItemTile } from '../../../../models/khub.model';
@Component({
  selector: 'app-home-courosal',
  templateUrl: './home-courosal.component.html',
  styleUrls: ['./home-courosal.component.scss']
})
export class HomeCourosalComponent implements OnInit, OnChanges {
  @Input() curosalData: any;
  @Input() title: string;
  @Input() screen: boolean;
  public tiles: ItemTile[];
  public load = true;
  constructor(private homeTile: KhubService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.title !== 'marketing') {
      this.tiles = this.homeTile.setTiles(this.curosalData);
    } else {
      this.tiles = this.homeTile.setMarketing(this.curosalData);
    }
  }

  fetchMore() {
    try {
      console.log('fetchmore');
    } catch (e) {
      throw e;
    }
  }
}
