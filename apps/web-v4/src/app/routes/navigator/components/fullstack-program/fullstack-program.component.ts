/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { NavigatorService } from '../../../../services/navigator.service';
import { MatSnackBar } from '@angular/material';
import { RoutingService } from '../../../../services/routing.service';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-fullstack-program',
  templateUrl: './fullstack-program.component.html',
  styleUrls: ['./fullstack-program.component.scss']
})
export class FullstackProgramComponent implements OnInit {
  fullStackProgram: any;
  availablePlaygrounds: any[] = [];
  fetchingCourses = false;
  availableCourses: any[];
  availableCertifications: any[] = [];
  playground: any[] = [];
  constructor(
    public routingSvc: RoutingService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private navSvc: NavigatorService,
    private contentSvc: ContentService,
    private utilSvc: UtilityService
  ) { }

  ngOnInit() {
    this.navSvc.fs.subscribe(fsdata => {
      const fsId = Number(this.route.snapshot.params.id);
      for (let i = 0; i < fsdata.length; i++) {
        if (fsdata[i].fs_id === fsId) {
          this.fullStackProgram = fsdata[i];
          const ids = this.fullStackProgram.fs_course.map(course => {
            return course.course_lex_link.split('/').reverse()[0];
          });
          this.fetchingCourses = true;
          this.contentSvc.fetchMultipleContent(ids).subscribe(data => {
            this.fetchingCourses = false;
            this.availableCourses = data.filter(item => Boolean(item));
          });
          this.playground = this.fullStackProgram.fs_playground.map(
            playItem => {
              return {
                id: playItem.playground_id,
                title: playItem.playground_name,
                description: playItem.playground_desc,
                thumbnail: playItem.playground_image,
                link: playItem.playground_link
              };
            }
          );
          const playgroundIds = this.fullStackProgram.fs_playground.map(
            playItem => {
              return playItem.playground_link.split('/').reverse()[0];
            }
          );

          this.contentSvc
            .fetchMultipleContent(playgroundIds)
            .subscribe(
              data =>
                (this.availablePlaygrounds = data.filter(item => Boolean(item)))
            );
          break;
        }
      }
      // console.log("playground >", this.playground);
    });
  }

  certificationClicked(certificateId) {
    const certification = this.availableCertifications.find(
      cert => cert.id === certificateId
    );
    this.utilSvc
      .sendCertificationEmail(
        certification.certificationType,
        certification.title,
        certification.description,
        certification.certificationUrl
      )
      .subscribe(
        data => {
          this.snackBar.open('A mail has been sent to you with more details');
        },
        error => {
          this.snackBar.open('Error sending mail. Please try again later');
        }
      );
  }

  practiseClicked(event) {
    const practise = this.playground.find(item => item.id === event);
    this.router.navigateByUrl(
      practise.link.replace('https://lex.infosysapps.com', '')
    );
  }
}
