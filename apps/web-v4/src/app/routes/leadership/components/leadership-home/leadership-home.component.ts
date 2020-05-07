/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ILeader } from '../../../../models/leadership.model';
import { LEADERS } from '../../constants/leaders';

@Component({
  selector: 'ws-leadership-home',
  templateUrl: './leadership-home.component.html',
  styleUrls: ['./leadership-home.component.scss']
})
export class LeadershipHomeComponent implements OnInit {
  leaders: ILeader[] = [];
  constructor() {}

  ngOnInit() {
    for (const leader in LEADERS) {
      if (LEADERS[leader].profile) {
        this.leaders.push(LEADERS[leader].profile);
      }
    }
  }
}
