/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, ElementRef, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigatorService } from '../../../../services/navigator.service';
import { UtilityService } from '../../services/utility.service';
import { RoutingService } from '../../../../services/routing.service';
import { ValuesService } from '../../../../services/values.service';
import { UtilityService as utility } from '../../../../services/utility.service';
import { MatSnackBar } from '@angular/material';
import { MutlilineSnackbarComponentComponent } from '../mutliline-snackbar-component/mutliline-snackbar-component.component';
import { THUMBNAIL_BASE_PATH } from '../../constants/path.constant';
import { ContentService } from '../../../../services/content.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  @ViewChild('toastSuccess', { static: true }) toastSuccess: ElementRef<any>;
  @ViewChild('toastFailure', { static: true }) toastFailure: ElementRef<any>;
  @ViewChild('toastAlreadyAdded', { static: true }) toastAlreadyAdded: ElementRef<any>;
  @ViewChild('toastNotLaunched', { static: true }) toastNotLaunched: ElementRef<any>;

  currentRole: any;
  currentVariant: any;
  lpdata: any;
  model: { [id: number]: string };
  roleId: string;
  variantId: number;
  errorOccurred = false;
  lpItems: any[];
  thumbnailsHash: { [lpId: string]: string } = {};

  isSmallScreen: boolean;

  addingGoalInProgress = false;
  THUMBNAIL_BASE_PATH = THUMBNAIL_BASE_PATH;
  navigatorGoalStatus = this.configSvc.instanceConfig.features.navigator.subFeatures.navigatorGoals;

  constructor(
    public routingSvc: RoutingService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private util: utility,
    private contentSvc: ContentService,
    private router: Router,
    private navigatorSvc: NavigatorService,
    private utilSvc: UtilityService,
    private valuesSvc: ValuesService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.roleId = this.route.snapshot.params.id;
    this.variantId = this.route.snapshot.queryParams.variant;
    this.getRoleVariantData();
    this.valuesSvc.isXSmall$.subscribe(value => {
      this.isSmallScreen = value;
    });
  }

  getRoleVariantData() {
    this.model = {};
    this.navigatorSvc.role(this.roleId).subscribe(
      data => {
        if (data && data.length) {
          this.currentRole = data[0];
          this.currentVariant =
            this.currentRole.variants.find(variant => variant.variant_id === this.variantId) ||
            this.currentRole.variants[0];
          this.navigatorSvc.lp.subscribe(lpdata => {
            this.lpdata = lpdata;
            this.lpItems = this.currentVariant.group.map(element => {
              this.model[element.lp_groupid] = element.group_member[0].lp_linked_id;
              return lpdata[element.group_member[0].lp_linked_id];
            });
            this.updateThumbnailsHash();
          });
        } else {
          this.errorOccurred = true;
        }
      },
      err => {
        this.errorOccurred = true;
      }
    );
  }

  onLpChanged(groupId, memberId) {
    this.model[groupId] = memberId;
    this.lpItems = this.currentVariant.group.map(element => {
      return this.lpdata[this.model[element.lp_groupid]];
    });
    this.updateThumbnailsHash();
  }

  updateThumbnailsHash() {
    this.contentSvc
      .fetchMultipleContent(
        Object.values(this.model)
          .map(item => this.lpdata[item].linked_program)
          .filter(identifier => !this.thumbnailsHash[identifier])
      )
      .subscribe(metas => {
        console.log('multiple ', metas);
        metas
          .filter(item => item !== null)
          .forEach(item => {
            this.thumbnailsHash[item.identifier] = item.appIcon;
          });
      });
  }

  getProfileTime(profiles, profileId) {
    return profiles.find(profile => profile.profile_id === profileId).profile_time;
  }

  createGoal() {
    if (!this.navigatorGoalStatus.available) {
      this.util.featureUnavailable('CREATE_GOAL_NAVIGATOR');
      return;
    }
    this.navigatorSvc.commons.subscribe(cgdata => {
      // console.log("lpdata >", this.lpdata);
      const goalData = Object.values(this.model)
        .map(lpid => this.lpdata[lpid])
        .filter(lp => cgdata[lp.lp_id])
        .map(lp => ({
          goal_id: cgdata[lp.lp_id],
          goal_duration: lp.profiles[0].profile_time,
          goal_type: 'common'
        }));
      const lpNames = Object.values(this.model)
        .map(lpid => this.lpdata[lpid])
        .filter(lp => cgdata[lp.lp_id])
        .map(lp => lp.lp_name);

      if (!goalData || !goalData.length) {
        this.snackBar.open(this.toastNotLaunched.nativeElement.value);
      } else {
        this.addingGoalInProgress = true;
        this.utilSvc.createGoal(goalData).subscribe(
          response => {
            this.addingGoalInProgress = false;
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
                snackbarLines.push(`${this.toastFailure.nativeElement.value} ${lpNames[i]}`);
              }
            }
            this.snackBar.openFromComponent(MutlilineSnackbarComponentComponent, {
              data: snackbarLines
            });
          },
          error => {
            this.addingGoalInProgress = false;
            this.snackBar.open(this.toastFailure.nativeElement.value);
          }
        );
      }
    });
    // this.snackBar.open(
    //   lp.lp_name + '- Goal not added. Program yet to be launched'
    // );
  }

  openLearningPath(id, profileId) {
    this.router.navigateByUrl('/navigator/lp/' + id + '?profile=' + profileId);
  }
}
