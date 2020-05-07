/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router'
import { MatTabChangeEvent } from '@angular/material'
import { filter, switchMap, takeUntil } from 'rxjs/operators'

import { IFeedbackSummary, EFeedbackType, EFeedbackRole, CustomTourService } from '@ws-widget/collection'
import { IResolveResponse, ConfigurationsService } from '@ws-widget/utils'
import { Subject } from 'rxjs'

@Component({
  selector: 'ws-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  currentTabIndex!: number
  tabs: string[]
  newItemsCount: number
  feedbackTypes: typeof EFeedbackType
  typeToRoleMap: Map<EFeedbackType, EFeedbackRole>
  feedbackSummary?: IFeedbackSummary
  rolesSet: Set<string>
  subscriptionSubject$: Subject<any>

  @ViewChild('feedbackstartTitle', { static: true }) feedbackstartTitleRef!: ElementRef<any>
  @ViewChild('feedbackstartSubtitle', { static: true }) feedbackstartSubtitleRef!: ElementRef<any>
  @ViewChild('myFeedbackTitle', { static: true }) myFeedbackTitleRef!: ElementRef<any>
  @ViewChild('myFeedbackSubtitle', { static: true }) myFeedbackSubtitleRef!: ElementRef<any>

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private configurationSvc: ConfigurationsService,
    private tour: CustomTourService,
  ) {
    this.subscriptionSubject$ = new Subject<any>()
    this.feedbackTypes = EFeedbackType
    this.newItemsCount = 0
    this.tabs = []
    this.rolesSet = new Set()

    const feedbackSummaryResolve = this.route.snapshot.data['feedbackSummary'] as IResolveResponse<
      IFeedbackSummary
      >
    if (feedbackSummaryResolve.data) {
      this.feedbackSummary = feedbackSummaryResolve.data
      this.newItemsCount = feedbackSummaryResolve.data.forActionCount
      this.feedbackSummary.roles.forEach(role => {
        if (
          role.enabled &&
          role.role !== EFeedbackRole.Author &&
          role.role !== EFeedbackRole.Platform
        ) {
          this.rolesSet.add(role.role)
        }
      })
    }

    this.typeToRoleMap = new Map([
      [EFeedbackType.Platform, EFeedbackRole.User],
      [EFeedbackType.ContentRequest, EFeedbackRole.Content],
      [EFeedbackType.ServiceRequest, EFeedbackRole.Service],
    ])

    this.initTabs()
  }

  ngOnInit() {
    let tab
    if (this.route.children[0].snapshot.url.length) {
      tab = this.route.children[0].snapshot.url[0].path
    } else {
      tab = ''
    }
    this.currentTabIndex = tab ? this.tabs.indexOf(tab) : 0

    this.router.events
      .pipe(
        takeUntil(this.subscriptionSubject$),
        filter(event => {
          if (event instanceof NavigationEnd) {
            return true
          }
          return false
        }),
        switchMap(() => this.route.children[0].url),
    )
      .subscribe(
        url => {
          try {
            const tabName = url[0].path
            this.currentTabIndex = this.tabs.indexOf(tabName)
          } catch (e) {
            this.currentTabIndex = 0
          }
        },
        () => {
          this.currentTabIndex = 0
        },
    )
  }

  ngAfterViewInit() {
    this.configurationSvc.tourGuideNotifier.next(true)
    this.tour.data = [{
      anchorId: 'feedback_start',
      title: this.feedbackstartTitleRef.nativeElement.value,
      content: this.feedbackstartSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    }, {
      anchorId: 'myFeedback',
      title: this.myFeedbackTitleRef.nativeElement.value,
      content: this.myFeedbackSubtitleRef.nativeElement.value,
      enableBackdrop: true,
    },
      // , {
      //   anchorId: 'another.myFeedback',
      //   title: this.myFeedbackTitleRef.nativeElement.value,
      //   content: this.myFeedbackSubtitleRef.nativeElement.value,
      //   enableBackdrop: true,
      //   route: '/app/feedback/my-feedback'
      // }, {
      //   anchorId: 'myFeedback',
      //   title: this.myFeedbackTitleRef.nativeElement.value,
      //   content: this.myFeedbackSubtitleRef.nativeElement.value,
      //   enableBackdrop: true,
      //   route: '/app/feedback/my-feedback'
      // }
    ]
  }

  ngOnDestroy() {
    this.subscriptionSubject$.next()
    this.subscriptionSubject$.complete()
  }

  navigateToTab(event: MatTabChangeEvent) {
    this.router.navigate([`${this.tabs[event.index] || this.tabs[0]}`], {
      relativeTo: this.route,
    })
  }

  showTab(feedbackType: EFeedbackType): boolean {
    const feedbackRole = this.typeToRoleMap.get(feedbackType)
    if (feedbackRole && this.rolesSet.has(feedbackRole) && this.rolesSet.size > 1) {
      return true
    }
    return false
  }

  initTabs() {
    const allTabs = [
      EFeedbackType.Platform,
      EFeedbackType.ContentRequest,
      EFeedbackType.ServiceRequest,
    ]

    allTabs.forEach(tab => {
      const feedbackRole = this.typeToRoleMap.get(tab)
      const roleDetail = this.feedbackSummary
        ? this.feedbackSummary.roles.find(role => role.role === feedbackRole)
        : undefined
      if (roleDetail && roleDetail.enabled) {
        this.tabs.push(tab)
      }
    })
  }
}
