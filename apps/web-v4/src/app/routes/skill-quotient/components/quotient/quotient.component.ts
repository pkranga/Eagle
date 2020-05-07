/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SkillQuotientService, RouteDataService } from '../../services';
import * as mySkills from '../../../../models/my-skills.model';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-quotient',
  templateUrl: './quotient.component.html',
  styleUrls: ['./quotient.component.scss']
})
export class QuotientComponent implements OnInit {
  isSiemensInstance = this.configSvc.instanceConfig.features.siemens.enabled;
  // isSiemensInstance = true;
  loader = true;
  skillId: string;
  skillQuotientData: mySkills.ISkillQuotientResponse;
  certificationQuotient: number;
  defaultQuotient: number;
  assessmentView = false;
  certificationView = false;
  skillName: string;
  relatedCard;
  constructor(
    private route: ActivatedRoute,
    private skillSvc: SkillQuotientService,
    private routeData: RouteDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe((queryParams: any) => {
      this.skillId = queryParams.get('skillId');
      this.loader = true;
      this.skillSvc.getSkillQuotient(this.skillId).subscribe(response => {
        this.skillQuotientData = response;
        this.loader = false;
      });
      if (this.skillId === undefined) {
        this.router.navigate(['/my-skills']);
      }
    });
  }
}
