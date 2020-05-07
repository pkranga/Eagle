/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IWsSocialSearchResultData } from '../../models/search.model'

@Component({
  selector: 'ws-app-blogs-card',
  templateUrl: './blogs-card.component.html',
  styleUrls: ['./blogs-card.component.scss'],
})
export class BlogsCardComponent implements OnInit {
  @Input() result: IWsSocialSearchResultData = {} as IWsSocialSearchResultData
  constructor() {}

  ngOnInit() {}
}
