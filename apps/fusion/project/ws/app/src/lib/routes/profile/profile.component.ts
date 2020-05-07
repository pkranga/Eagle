/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { Subscription } from 'rxjs'
import {
  ValueService,
  ConfigurationsService,
  NsPage,
  LogoutComponent,
} from '@ws-widget/utils'
import { map } from 'rxjs/operators'
import { MatDialog } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { CustomTourService } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy, AfterViewInit {
  tabName = 'My Dashboard'
  private defaultSideNavBarOpenedSubscription: Subscription | null = null
  isLtMedium$ = this.valueSvc.isLtMedium$
  mode$ = this.isLtMedium$.pipe(
    map((isMedium: boolean) => (isMedium ? 'over' : 'side')),
  )
  screenSizeIsLtMedium = false
  showText = true
  isSkills = false
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  enabledTabs = this.activatedRoute.snapshot.data.pageData.data.enabledTabs

  @ViewChild('profileTitle', { static: true }) profileTitleRef!: ElementRef<any>
  @ViewChild('profileSubTitle', { static: true }) profileSubTitleRef!: ElementRef<any>
  @ViewChild('profileLogout', { static: true }) profileLogoutRef!: ElementRef<any>
  @ViewChild('profileLogoutSubtitle', { static: true }) profileLogoutSubtitleRef!: ElementRef<any>
  @ViewChild('profileDashboard', { static: true }) profileDashboardRef!: ElementRef<any>
  @ViewChild('profileDashboardSubtitle', { static: true }) profileDashboardSubtitleRef!: ElementRef<any>
  @ViewChild('profileLearning', { static: true }) profileLearningRef!: ElementRef<any>
  @ViewChild('profileLearningSubtitle', { static: true }) profileLearningSubtitleRef!: ElementRef<any>
  @ViewChild('profileAchievement', { static: true }) profileAchievementeRef!: ElementRef<any>
  @ViewChild('profileAchievementSubtitle', { static: true }) profileAchievementSubtitleRef!: ElementRef<any>
  @ViewChild('profileInterest', { static: true }) profileInterestRef!: ElementRef<any>
  @ViewChild('profileInterestSubtitle', { static: true }) profileInterestSubtitleRef!: ElementRef<any>
  @ViewChild('profileCalender', { static: true }) profileCalenderRef!: ElementRef<any>
  @ViewChild('profileCalenderSubtitle', { static: true }) profileCalenderSubtitleRef!: ElementRef<any>
  @ViewChild('profileUsage', { static: true }) profileUsageRef!: ElementRef<any>
  @ViewChild('profileUsageSubtitle', { static: true }) profileUsageSubtitleRef!: ElementRef<any>
  @ViewChild('profileSettings', { static: true }) profileSettingsRef!: ElementRef<any>
  @ViewChild('profileSettingsSubtitle', { static: true }) profileSettingsSubtitleRef!: ElementRef<any>

  constructor(
    private dialog: MatDialog,
    private valueSvc: ValueService,
    private configSvc: ConfigurationsService,
    private activatedRoute: ActivatedRoute,
    private tour: CustomTourService,
  ) { }

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(
      (isLtMedium: boolean) => {
        this.screenSizeIsLtMedium = isLtMedium
      },
    )
    if (this.configSvc && this.configSvc.restrictedFeatures && this.configSvc.restrictedFeatures.has('my_skills')) {
      this.isSkills = false
    } else {
      this.isSkills = true
    }
  }
  tabUpdate(tab: string) {
    this.tabName = tab
    if (!this.screenSizeIsLtMedium) {
      this.showText = !this.showText
    }
  }
  ngAfterViewInit() {
    this.configSvc.tourGuideNotifier.next(true)
    this.tour.data = [{
      anchorId: 'profile_start',
      title: this.profileTitleRef.nativeElement.value,
      content: this.profileSubTitleRef.nativeElement.value,
      placement: 'auto',
      enableBackdrop: true,
    }, {
      anchorId: 'profile_logout',
      title: this.profileLogoutRef.nativeElement.value,
      content: this.profileLogoutSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    }, {
      anchorId: 'profile_dashboard',
      title: this.profileDashboardRef.nativeElement.value,
      content: this.profileDashboardSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    }, {
      anchorId: 'profile_learning',
      title: this.profileLearningRef.nativeElement.value,
      content: this.profileLearningSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    },
    {
      anchorId: 'profile_achievement',
      title: this.profileAchievementeRef.nativeElement.value,
      content: this.profileAchievementSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    },
    {
      anchorId: 'profile_interest',
      title: this.profileInterestRef.nativeElement.value,
      content: this.profileInterestSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    },
    {
      anchorId: 'profile_calender',
      title: this.profileCalenderRef.nativeElement.value,
      content: this.profileCalenderSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    },
    {
      anchorId: 'profile_collaborators',
      title: this.profileCalenderRef.nativeElement.value,
      content: this.profileCalenderSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    },
    {
      anchorId: 'profile_usage',
      title: this.profileUsageRef.nativeElement.value,
      content: this.profileUsageSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    },
    {
      anchorId: 'profile_settings',
      title: this.profileSettingsRef.nativeElement.value,
      content: this.profileSettingsSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    }]
  }
  ngOnDestroy() {
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
    this.configSvc.tourGuideNotifier.next(false)
  }
  logout() {
    this.dialog.open<LogoutComponent>(LogoutComponent)
  }
}
