/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RouteDataService } from '../../services/route-data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { RoutingService } from '../../../../services/routing.service';
import { IAvailableData } from '../../../../models/skills-role.model';
@Component({
  selector: 'ws-learning-path',
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.scss']
})
export class LearningPathComponent implements OnInit {
  courses: IAvailableData;
  roleId: string;
  mandatoryCourses: Array<any> = [];
  PrerequisiteCourses: Array<any> = [];
  DesirableCourses: Array<any> = [];
  constructor(
    private routeSvc: RouteDataService,
    private router: Router,
    private route: ActivatedRoute,
    public routingSvc: RoutingService
  ) {}

  ngOnInit() {
    this.roleId = this.route.snapshot.params.role_id;
    this.courses = this.routeSvc.getStoredData('availableCourses');
    if (this.courses === undefined) {
      this.router.navigate([`/skills-role/${this.roleId}`]);
    }
    this.fetchData();
  }
  fetchData() {
    if (this.courses.available_courses != undefined) {
      this.courses.available_courses.map(cur => {
        if (cur.learning_type === 'Mandatory') {
          this.mandatoryCourses.push(cur);
        } else if (cur.learning_type === 'Pre-requisite') {
          this.PrerequisiteCourses.push(cur);
        } else {
          this.DesirableCourses.push(cur);
        }
      });
    } else {
      this.router.navigate([`/skills-role/${this.roleId}`]);
    }
  }
}
