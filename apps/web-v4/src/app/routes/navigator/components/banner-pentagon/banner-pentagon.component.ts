/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-banner-pentagon',
  templateUrl: './banner-pentagon.component.html',
  styleUrls: ['./banner-pentagon.component.scss']
})
export class BannerPentagonComponent implements OnInit {
  requestProcessing = true;
  errorOccurred = false;
  availableCourses: any[];
  fetchingCourses = false;

  constructor(public routingSvc: RoutingService, private navSvc: NavigatorService, private contentSvc: ContentService) { }

  ngOnInit() {
    this.trackClicked('Accelerate');
  }

  trackClicked(event) {
    this.fetchingCourses = true;
    this.navSvc.dm.subscribe(
      smdata => {
        for (let i = 0; i < smdata.length; i++) {
          if (smdata[i].arm_name === event) {
            // this.availableCourses = smdata[i].courses;
            // console.log("banner pentag", this.availableCourses);
            const ids = smdata[i].courses.map(course => {
              return course.course_link.split('/').reverse()[0];
            });
            this.availableCourses = [];
            this.contentSvc.fetchMultipleContent(ids).subscribe(data => {
              this.fetchingCourses = false;
              this.availableCourses = data.filter(item => Boolean(item));
            });
          }
        }
        this.requestProcessing = false;
      },
      err => {
        this.errorOccurred = true;
        this.requestProcessing = false;
      }
    );
  }
}
