/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit } from '@angular/core';
import * as mySkills from '../../../../models/my-skills.model';
@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.scss']
})
export class CourseCardComponent implements OnInit {
  @Input() data: mySkills.IAvailableCertificationData;
  courseName: string;
  constructor() {}
  ngOnInit() {
    if (this.data.name != undefined) {
      this.courseName = this.data.name.split('-')[0];
    }
  }
}
