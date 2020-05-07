/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ICatalog } from '../../../../models/catalog.model';
import { CatalogService } from "../../../../services/catalog.service";
@Component({
  selector: 'ws-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss']
})
export class ChannelComponent implements OnInit {
  channels = [];
  channelId: string = '1542794660419';
  constructor(private route: ActivatedRoute, private catalogsvc: CatalogService) { }

  ngOnInit() {
    const catalog = this.route.snapshot.data.catalog.children[0];
    const path: ICatalog[] = this.catalogsvc.getPath(catalog, this.channelId)
    // console.log("path", path)
    path.shift();
    const prefix = path.map(u => u.value).join('/')
    // console.log("prefix", prefix)
    const infyTv = path.pop();

    // console.log("infyTv", infyTv)
    this.channels = infyTv.children.map(u => ({

      name: u.value,
      queryParam: {
        f: JSON.stringify({ tags: [`${prefix}/${u.value}`] })

      }
    }))
  }
}
