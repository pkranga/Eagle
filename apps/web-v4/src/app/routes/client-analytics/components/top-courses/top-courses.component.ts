/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { Globals } from '../../utils/globals';
export interface PeriodicElement {
  Goals: string;
  users: number;
}


@Component({
  selector: 'app-top-courses',
  templateUrl: './top-courses.component.html',
  styleUrls: ['./top-courses.component.scss']
})
export class TopCoursesComponent implements OnInit {
  @Input() clientData;
  displayedColumns: string[] = ['goals', 'users'];
  dataSource;
  goalDetails = [];
  constructor(private globals: Globals) { }

  ngOnInit() {
    this.tableData(this.clientData);
  }

  tableData(data) {
    this.goalDetails = [];
    this.goalDetails = data.goal_details.filter(s => s.goal_title)
      .map(m => ({ goals: m.goal_title, users: m.doc_count }));
  }
}
