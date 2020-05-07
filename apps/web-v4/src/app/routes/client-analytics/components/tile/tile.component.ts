/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Globals } from '../../utils/globals'
@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {
  @Input() tileTitle: String;
  @Input() firstValue: number;
  @Input() secondValue: number;
  @Input() thirdValue: number;
  @Input() fourthValue: number;
  @Input() titleFirstSubHeading: string;
  @Input() titleSecondSubHeading: string;
  @Input() titleThirdSubHeading: string;
  @Input() titleFourthSubHeading: string;
  @Output() filterEvent = new EventEmitter<string>();
  constructor(private globals: Globals) { }

  ngOnInit() {
    this.processingValues();
  }

  ngOnChanges() {
    this.processingValues();
  }

  processingValues() {
    if (this.firstValue === undefined) {
      this.firstValue = 0;
    }
    if (this.titleFirstSubHeading === 'All users' && this.globals.filter_trend.length > 0) {
      this.firstValue = 0;
    }
    if (this.secondValue === undefined) {
      this.secondValue = 0;
    }
    if (this.thirdValue === undefined) {
      this.thirdValue = 0;
    }
    if (this.fourthValue === undefined) {
      this.fourthValue = 0;
    }

    if (this.firstValue % 1 !== 0) {
      this.firstValue = +this.firstValue.toFixed(2);
    }
    if (this.secondValue % 1 !== 0) {
      this.secondValue = +this.secondValue.toFixed(2);
    }
    if (this.thirdValue % 1 !== 0) {
      this.thirdValue = +this.thirdValue.toFixed(2);
    }
    if (this.fourthValue % 1 !== 0) {
      this.fourthValue = +this.fourthValue.toFixed(2);
    }
  }
}
