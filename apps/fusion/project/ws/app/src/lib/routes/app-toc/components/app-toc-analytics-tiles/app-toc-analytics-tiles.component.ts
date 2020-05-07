/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'ws-app-app-toc-analytics-tiles',
  templateUrl: './app-toc-analytics-tiles.component.html',
  styleUrls: ['./app-toc-analytics-tiles.component.scss'],
})
export class AppTocAnalyticsTilesComponent implements OnInit {
  @Input() uniqueUsers!: number
  @Input() description!: string
  @Input() title!: string
  @Input() category1!: string
  @Input() category2!: string
  @Input() category3!: string
  @Output() clickEvent = new EventEmitter<string>()

  constructor() { }

  ngOnInit() {
  }
  onClick(type: string) {
    this.clickEvent.emit(type)
  }
}
