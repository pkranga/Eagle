/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit, OnChanges {
  @Input() title;
  @Input() tileValue;
  @Input() comment;
  @Input() showSecond: boolean;
  @Input() orgValue: number;
  @Input() message;
  absoluteValue;
  value = false;
  constructor() {}
  keyword;
  ngOnInit() {
    this.processingValues();
  }
  ngOnChanges() {
    this.processingValues();
  }

  processingValues() {
    if (this.tileValue === undefined) {
      this.tileValue = 0;
    }
    if (this.orgValue === undefined) {
      this.orgValue = 0;
    }
    if (this.tileValue % 1 !== 0 && typeof this.tileValue === 'number') {
      this.tileValue = +this.tileValue.toFixed(2);
    }
    if (this.orgValue % 1 !== 0 && typeof this.orgValue === 'number') {
      this.orgValue = +this.orgValue.toFixed(2);
    }
    if (this.orgValue < 0) {
      this.absoluteValue = Math.abs(this.orgValue);
    }
  }
}
