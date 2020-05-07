/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit } from '@angular/core';
import { IWsPagesConfig } from '../../models/ws-pages.models';

@Component({
  selector: 'ws-pages',
  templateUrl: './ws-pages.component.html',
  styleUrls: ['./ws-pages.component.scss']
})
export class WsPagesComponent implements OnInit {
  @Input() config: IWsPagesConfig

  constructor() { }

  ngOnInit() {
  }

}
