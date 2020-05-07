/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-plans-card',
  templateUrl: './plans-card.component.html',
  styleUrls: ['./plans-card.component.scss']
})
export class PlansCardComponent implements OnInit {
  @Input() pieData: any;
  @Input() completed: number;
  @Input() progress: number;
  @Input() title: string;
  @Input() system: string;
  pieLables = [];
  pieProcessedData = [];
  margin = {
    top: 25,
    right: 20,
    bottom: 25,
    left: 20
  };
  constructor() { }

  ngOnInit() {
    this.pieData.map(ele => {
      this.pieLables.push(ele.key);
      this.pieProcessedData.push(ele.y);
    });
  }
}
