/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Globals } from '../../utils/globals';
import { PageEvent } from '@angular/material';
@Component({
  selector: 'app-client-tile',
  templateUrl: './client-tile.component.html',
  styleUrls: ['./client-tile.component.scss']
})
export class ClientTileComponent implements OnInit {
  // @Input() tileTitle: String;
  // @Input() firstValue: number;
  // @Input() secondValue: number;
  // @Input() thirdValue: number;
  // @Input() titleFirstSubHeading: any;
  // @Input() titleSecondSubHeading: any;
  // @Input() titleThirdSubHeading: any;
  // @Output() filterEvent = new EventEmitter<string>();
  @Input() data;
  length = 100;
  page1 = true;
  page2 = false;
  constructor(public globals: Globals) {}

  ngOnInit() {
    this.processingValues();
  }

  ngOnChanges() {
    this.processingValues();
  }

  processingValues() {
    if (this.data.user_goal === undefined) {
      this.data.user_goal = 0;
    }
    if (this.data.user_shared_goal === undefined) {
      this.data.user_shared_goal = 0;
    }
    if (this.data.user_playlist === undefined) {
      this.data.user_playlist = 0;
    }
    if (this.data.user_shared_playlist === undefined) {
      this.data.user_shared_playlist = 0;
    }
    if (this.data.user_goal % 1 !== 0) {
      this.data.user_goal = +this.data.user_goal.toFixed(2);
    }
    if (this.data.user_shared_goal % 1 !== 0) {
      this.data.user_shared_goal = +this.data.user_shared_goal.toFixed(2);
    }
    if (this.data.user_playlist % 1 !== 0) {
      this.data.user_playlist = +this.data.user_playlist.toFixed(2);
    }
    if (this.data.user_shared_playlist % 1 !== 0) {
      this.data.user_shared_playlist = +this.data.user_shared_playlist.toFixed(2);
    }
  }
  onLeftArrow() {
    this.page1 = true;
    this.page2 = false;
  }
  onRightArrow() {
    this.page2 = true;
    this.page1 = false;
  }
}
