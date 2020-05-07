/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { SafeHtml, DomSanitizer } from '@angular/platform-browser'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Data } from '@angular/router'
import { Subscription, Observable } from 'rxjs'

import { NsContent } from '@ws-widget/collection'
import { ConfigurationsService } from '@ws-widget/utils'

import { NsAppToc } from '../../models/app-toc.model'
import { AppTocService } from '../../services/app-toc.service'
path

@Component({
path
path
path
})
export class AppTocOverviewPathfindersComponent implements OnInit, OnDestroy {
  content: NsContent.IContent | null = null
  routeSubscription: Subscription | null = null
  viewMoreRelatedTopics = false
  hasTocStructure = false
  tocStructure: NsAppToc.ITocStructure | null = null
  askAuthorEnabled = true
  trainingLHubEnabled = false
  isSiemensdetailsShown = false
  ispathfinderdetailsShown = false
  trainingLHubCount$?: Observable<number>
  body: SafeHtml | null = null
  firstResourceLink: any
  isStartButtonAvailable = false

  contentTypes = NsContent.EContentTypes
  showMoreGlance = false

  constructor(
    private route: ActivatedRoute,
    private tocSharedSvc: AppTocService,
    private configSvc: ConfigurationsService,
    private domSanitizer: DomSanitizer,
    private tocSvc: AppTocPathfindersService,
  ) {
    if (this.configSvc.instanceConfig) {
      if (this.configSvc.instanceConfig.rootOrg === 'Infosys Ltd') {
        this.isSiemensdetailsShown = true
      } else {
        this.isSiemensdetailsShown = false
      }
    }
  }

  ngOnInit() {
    if (this.route && this.route.parent) {
      this.routeSubscription = this.route.parent.data.subscribe((data: Data) => {
        this.initData(data)
      })
    }
  }

  checkIfArtifactUrlAvailable(): boolean {
    return this.content && this.content.artifactUrl.length > 0 ? true : false
  }

  checkStartButton() {
    if (this.content) {
      this.tocSvc.verifyAttendedUsers(this.content.identifier).subscribe(
        (response: { [key: string]: boolean }) => {
          if (response && this.content) {
            this.isStartButtonAvailable = this.checkIfArtifactUrlAvailable() &&
              response[this.content.identifier] ? response[this.content.identifier] : false
          }
        },
      )
    }
  }
  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
  }

  get showSubtitleOnBanner() {
    return this.tocSharedSvc.subtitleOnBanners
  }
  get showDescription() {
    if (this.content && !this.content.body) {
      return true
    }
    return this.tocSharedSvc.showDescription
  }

  private initData(data: Data) {
    const initData = this.tocSharedSvc.initData(data)
    this.content = initData.content
    this.body = this.domSanitizer.bypassSecurityTrustHtml(
      this.content ? this.content.body || '' : '',
    )
    const userProfile = this.configSvc.userProfile

    if (this.content && this.content.learningMode === 'Closed') {
      if (userProfile &&
        this.content.creatorDetails.map(user => user.id).indexOf(userProfile.userId) === -1) {
        this.checkStartButton()
      } else {
        this.isStartButtonAvailable = this.checkIfArtifactUrlAvailable()
      }
    } else if (this.content && this.content.learningMode === 'Open') {

      this.isStartButtonAvailable = this.checkIfArtifactUrlAvailable()
    }
  }
}
