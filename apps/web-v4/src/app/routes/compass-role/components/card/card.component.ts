/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../../../../services/config.service';
import { IAvailableCourse } from '../../../../models/skills-role.model';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @Input() courseDetails: IAvailableCourse;
  // @Input() alternative: boolean;
  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;
  constructor(private router: Router, private configSvc: ConfigService) {}

  ngOnInit() {
    console.log(this.courseDetails);
  }

  onCourseClick(courseDetails) {
    this.router.navigateByUrl('/toc/' + courseDetails.lex_course_id + '/about');
  }
}
