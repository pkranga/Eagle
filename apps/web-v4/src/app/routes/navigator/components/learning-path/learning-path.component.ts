/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../services/utility.service';
import { NavigatorService } from '../../../../services/navigator.service';
import { MatSnackBar } from '@angular/material';
import { RoutingService } from '../../../../services/routing.service';
import { UtilityService as utility } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';
import { IGoalAddUpdateResponse } from '../../../../models/goal.model';
import { ContentService } from '../../../../services/content.service';
@Component({
  selector: 'app-learning-path',
  templateUrl: './learning-path.component.html',
  styleUrls: ['./learning-path.component.scss']
})
export class LearningPathComponent implements OnInit {
  @ViewChild('toastSuccess', { static: true }) toastSuccess: ElementRef<any>;
  @ViewChild('toastFailure', { static: true }) toastFailure: ElementRef<any>;
  @ViewChild('toastNotLaunched', { static: true }) toastNotLaunched: ElementRef<any>;
  @ViewChild('toastAlreadyAdded', { static: true }) toastAlreadyAdded: ElementRef<any>;

  learningPath: any;
  courses: any[] = [];
  practises: any[] = [];
  availableCertifications: any[] = [];
  selectedProfileId: any;
  showProfile: boolean;
  randomNumber: number;

  addingGoalsInProgress = false;
  isNavigatorGoalsEnabled = this.configSvc.instanceConfig.features.navigator.subFeatures.navigatorGoals.enabled;

  constructor(
    public routingSvc: RoutingService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
    private navSvc: NavigatorService,
    private utilSvc: UtilityService,
    private contentSvc: ContentService,
    private util: utility,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    this.showProfile = this.route.snapshot.queryParams.showProfile;
    this.navSvc.lp.subscribe(lpdata => {
      this.learningPath = lpdata[this.route.snapshot.params.id];
      if (this.learningPath.profiles && this.learningPath.profiles.length > 0) {
        this.selectedProfileId = this.route.snapshot.queryParams.profile || this.learningPath.profiles[0].profile_id;
      }
      const ids = this.learningPath.lp_playground.map(item => {
        return item.playground_link.split('/').reverse()[0];
      });
      this.contentSvc.fetchMultipleContent(ids).subscribe(data => {
        this.practises = data.filter(item => Boolean(item));
      });
      this.getCoursesForProfile(this.selectedProfileId);
    });
  }

  getCoursesForProfile(idx) {
    const courseIds = this.learningPath.profiles
      .find(profile => profile.profile_id === Number(idx))
      .courses.map(course => {
        return course.course_lex_link.split('/').reverse()[0];
      });
    this.contentSvc.fetchMultipleContent(courseIds).subscribe(data => {
      this.courses = data.filter(item => Boolean(item));
    });
    // return this.learningPath.profiles[idx].courses.map(course => {
    //   return {
    //     id: course.course_id,
    //     title: course.course_name,
    //     description: course.course_description,
    //     link: course.course_lex_link
    //   };
    // });
  }

  onCourseClicked(courseId) {
    const course = this.courses.find(item => item.identifier === courseId);
    const url = course.link.replace('https://lex.infosysapps.com', '');
    this.router.navigateByUrl(url);
  }

  onPractiseClicked(practiceId) {
    const playItem = this.learningPath.lp_playground.find(item => item.playground_id === practiceId);
    const url = playItem.playground_link.replace('https://lex.infosysapps.com/', '');
    this.router.navigateByUrl(url);
  }

  certificationClicked(certificateId) {
    const certification = this.availableCertifications.find(item => item.id === certificateId);
    this.utilSvc
      .sendCertificationEmail(
        certification.certificationType,
        certification.title,
        certification.description,
        certification.certificationUrl
      )
      .subscribe(
        data => {
          // this.snackBar.open('A mail has been sent to you with more details');
        },
        error => {
          // this.snackBar.open('Error sending mail. Please try again later');
        }
      );
  }

  openLearningPath() {
    this.router.navigateByUrl('/navigate/lp/' + this.learningPath.lp_id);
  }

  createGoal() {
    if (!this.configSvc.instanceConfig.features.navigator.subFeatures.navigatorGoals.available) {
      this.util.featureUnavailable('CREATE_GOAL_NAVIGATOR');
      return;
    }
    this.addingGoalsInProgress = true;
    this.navSvc.commons.subscribe(cgdata => {
      if (cgdata[this.learningPath.lp_id]) {
        this.utilSvc
          .createGoal([
            {
              goal_id: cgdata[this.learningPath.lp_id],
              goal_duration: this.learningPath.profiles[0].profile_time,
              goal_type: 'common'
            }
          ])
          .subscribe(
            response => {
              this.addingGoalsInProgress = false;

              if (response.response[0].result === 'success') {
                this.snackBar.open(this.toastSuccess.nativeElement.value);
              } else if (
                response.response[0].result === 'failed' &&
                response.response[0].fail_reason === 'already existing goal'
              ) {
                this.snackBar.open(this.toastAlreadyAdded.nativeElement.value);
              } else {
                this.snackBar.open(this.toastFailure.nativeElement.value);
              }
            },
            error => {
              this.addingGoalsInProgress = false;
              this.snackBar.open(this.toastFailure.nativeElement.value);
            }
          );
      } else {
        this.addingGoalsInProgress = false;
        this.snackBar.open(this.learningPath.lp_name + ' - ' + this.toastNotLaunched.nativeElement.value);
      }
    });
  }

  profileDescription(courses) {
    return courses.map(course => course.course_name).join(', ');
  }

  onProfileChange(idx) {
    this.selectedProfileId = idx;
    this.courses = [];
    this.getCoursesForProfile(idx);
    this.generateRandomNumber();
  }

  generateRandomNumber() {
    this.randomNumber = Date.now();
  }
}
