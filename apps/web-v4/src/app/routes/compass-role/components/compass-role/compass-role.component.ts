/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { CompassRoleService } from '../../services/compass-role.service';
import { RouteDataService } from '../../services/route-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '../../../../services/config.service';
import { FetchStatus } from '../../../../models/status.model';
import * as mySkills from '../../../../models/skills-role.model';
@Component({
  selector: 'app-compass-role',
  templateUrl: './compass-role.component.html',
  styleUrls: ['./compass-role.component.scss']
})
export class CompassRoleComponent implements OnInit {
  roleData: mySkills.ISkillsRole;
  // emailId = 'senthilbalaji.g';
  availableCourses: Array<any> = [];
  roleId: string;
  scheduleFetchStatus: FetchStatus = 'fetching';
  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;
  constructor(
    private compassSvc: CompassRoleService,
    private router: Router,
    private route: ActivatedRoute,
    private routeSvc: RouteDataService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.scheduleFetchStatus = 'fetching';
    this.roleId = this.route.snapshot.params.role_id;
    this.compassSvc.getRoles(this.roleId).subscribe(
      res => {
        this.roleData = res;
        this.scheduleFetchStatus = 'done';
      },
      err => {
        this.scheduleFetchStatus = 'error';
      }
    );
  }
  onCourseClick(course) {
    this.routeSvc.setStoredData('availableCourses', course);
    this.router.navigateByUrl(`/skills-role/${this.roleId}/lp/` + course.lex_id);
  }
}
