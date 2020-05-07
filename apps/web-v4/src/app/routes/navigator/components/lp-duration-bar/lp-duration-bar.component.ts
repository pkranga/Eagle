/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-lp-duration-bar',
  templateUrl: './lp-duration-bar.component.html',
  styleUrls: ['./lp-duration-bar.component.scss']
})
export class LpDurationBarComponent implements OnInit {
  @Input()
  id: string;

  @Input()
  barLabel = '';

  @Input()
  barDescription = '';

  @Input()
  barWidth = '100%';
  @Input()
  duration = '';

  @Output()
  barClicked = new EventEmitter();

  constructor() {}

  ngOnInit() {
    // console.log(this.barWidth);
  }
}
