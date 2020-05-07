/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-toc-training-card',
  templateUrl: './toc-training-card.component.html',
  styleUrls: ['./toc-training-card.component.scss']
})
export class TocTrainingCardComponent implements OnInit {
  @Input() training: any;
  expanded = false;
  registered = false;
  courseColumns = ['courseName', 'courseDuration', 'courseLocation', 'courseTime'];

  constructor() {}

  ngOnInit() {}

  toggleCard() {
    this.expanded = !this.expanded;
  }

  toggleRegistration() {
    this.registered = !this.registered;
  }
}
