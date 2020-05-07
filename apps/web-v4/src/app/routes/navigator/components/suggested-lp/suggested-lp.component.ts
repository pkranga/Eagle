/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { MatSnackBar } from '@angular/material';
import { UtilityService } from '../../services/utility.service';
import { RoutingService } from '../../../../services/routing.service';
import { MutlilineSnackbarComponentComponent } from '../mutliline-snackbar-component/mutliline-snackbar-component.component';
import { ConfigService } from '../../../../services/config.service';
import { UtilityService as utility } from '../../../../services/utility.service';
@Component({
  selector: 'app-suggested-lp',
  templateUrl: './suggested-lp.component.html',
  styleUrls: ['./suggested-lp.component.scss']
})
export class SuggestedLpComponent implements OnInit {
  @ViewChild('toastSuccess', { static: true }) toastSuccess: ElementRef<any>;
  @ViewChild('toastFailure', { static: true }) toastFailure: ElementRef<any>;
  @ViewChild('toastAlreadyAdded', { static: true }) toastAlreadyAdded: ElementRef<any>;
  @ViewChild('toastNotLaunched', { static: true }) toastNotLaunched: ElementRef<any>;

  lpdata = this.route.snapshot.data.lpdata.data;
  pageError = this.route.snapshot.data.lpdata.error;
  selectedSkills: string;
  skillsList: string[];
  suggestedLp: any[] = [];
  otherLp: any[] = [];
  shouldClip = {
    other: true,
    suggested: true
  };

  addingGoalsInProgress = false;
  isNavigatorGoalsStatus = this.configSvc.instanceConfig.features.navigator.subFeatures.navigatorGoals;

  constructor(
    public routingSvc: RoutingService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private utilSvc: UtilityService,
    private navSvc: NavigatorService,
    private router: Router,
    private util: utility,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.skillsList = params.selection.split(',').filter(item => item.length);
      this.suggestedLp = [];
      this.otherLp = [];
      Object.values(this.lpdata).forEach((lp: any) => {
        const allTech = [];
        lp.profiles.forEach(profile => allTech.push(...profile.technology));
        if (this.hasCommonTech(this.skillsList, allTech)) {
          this.suggestedLp.push(lp);
        } else {
          this.otherLp.push(lp);
        }
      });
    });
  }

  removeSkill(skill: string) {
    this.skillsList = this.skillsList.filter(item => item !== skill);
    this.router.navigate(['/navigator/suggestions/lp'], {
      queryParams: { selection: this.skillsList.join(',') }
    });
  }

  createGoalClicked(selectedLp) {
    // console.log(this.lpdata);
    if (!this.isNavigatorGoalsStatus.available) {
      this.util.featureUnavailable('CREATE_GOAL_NAVIGATOR');
      return;
    }
    this.navSvc.commons.subscribe(cgdata => {
      const goalData = selectedLp
        .map(option => option.value)
        .map(lpId => this.lpdata[lpId])
        .filter(lp => cgdata[lp.lp_id])
        .map(lp => ({
          goal_id: cgdata[lp.lp_id],
          goal_duration: lp.profiles[0].profile_time,
          goal_type: 'common'
        }));

      const lpNames = selectedLp
        .map(option => option.value)
        .map(lpId => this.lpdata[lpId])
        .filter(lp => cgdata[lp.lp_id])
        .map(lp => lp.lp_name);
      // this.snackBar.open(
      //   lp.lp_name + '- Goal not added. Program yet to be launched'
      // );
      if (!goalData || !goalData.length) {
        this.snackBar.open(this.toastNotLaunched.nativeElement.value);
      } else {
        this.addingGoalsInProgress = true;
        this.utilSvc.createGoal(goalData).subscribe(
          response => {
            this.addingGoalsInProgress = false;
            const snackbarLines = [];
            for (let i = 0; i < response.response.length; i++) {
              if (response.response[i].result === 'success') {
                snackbarLines.push(this.toastSuccess.nativeElement.value + lpNames[i]);
              } else if (
                response.response[i].result === 'failed' &&
                response.response[i].fail_reason === 'already existing goal'
              ) {
                snackbarLines.push(lpNames[i] + ' ' + this.toastAlreadyAdded.nativeElement.value);
              } else {
                snackbarLines.push(this.toastFailure.nativeElement.value + ' ' + lpNames[i]);
              }
            }
            this.snackBar.openFromComponent(MutlilineSnackbarComponentComponent, {
              data: snackbarLines
            });
            // this.snackBar.open(this.toastSuccess.nativeElement.value);
          },
          error => {
            this.addingGoalsInProgress = false;
            this.snackBar.open(this.toastFailure.nativeElement.value);
          }
        );
      }

      // this.snackBar.open(
      //   lp.lp_name + '- Goal not added. Program yet to be launched'
      // );
    });
  }

  hasCommonTech(arr1, arr2) {
    return arr1.filter(value => -1 !== arr2.indexOf(value)).length > 0;
  }

  openLearningPath(id) {
    this.router.navigateByUrl('/navigator/lp/' + id);
  }

  suggestedChanged(suggestedCheckList) {
    console.log(suggestedCheckList);
  }

  othersChanged(othersCheckList) {}

  shouldEnableCreateButton(selectedLp) {
    return Object.values(selectedLp).indexOf(true) > -1;
  }

  clip(arr: any[], shouldClip) {
    return shouldClip ? arr.slice(0, 5) : arr;
  }
}
