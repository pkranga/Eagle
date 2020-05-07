/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ws-widget-resolver',
  templateUrl: './widget-resolver.component.html',
  styleUrls: ['./widget-resolver.component.scss']
})
export class WidgetResolverComponent implements OnInit {

  @Input() config;
  constructor() { }

  ngOnInit() {
  }

}
