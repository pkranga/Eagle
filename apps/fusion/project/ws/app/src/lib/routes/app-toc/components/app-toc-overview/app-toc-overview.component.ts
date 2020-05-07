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
import { TrainingApiService } from '../../../infy/routes/training/apis/training-api.service'
import { retry } from 'rxjs/operators'
import { TrainingService } from '../../../infy/routes/training/services/training.service'

@Component({
  selector: 'ws-app-app-toc-overview',
  templateUrl: './app-toc-overview.component.html',
  styleUrls: ['./app-toc-overview.component.scss'],
})
export class AppTocOverviewComponent implements OnInit, OnDestroy {
  content: NsContent.IContent | null = null
  routeSubscription: Subscription | null = null
  viewMoreRelatedTopics = false
  hasTocStructure = false
  tocStructure: NsAppToc.ITocStructure | null = null
  askAuthorEnabled = true
  trainingLHubEnabled = false
  trainingLHubCount$?: Observable<number>
  body: SafeHtml | null = null

  constructor(
    private route: ActivatedRoute,
    private tocSharedSvc: AppTocService,
    private configSvc: ConfigurationsService,
    private trainingApi: TrainingApiService,
    private trainingSvc: TrainingService,
    private domSanitizer: DomSanitizer,
  ) {
    if (this.configSvc.restrictedFeatures) {
      this.askAuthorEnabled = !this.configSvc.restrictedFeatures.has('askAuthor')
      this.trainingLHubEnabled = !this.configSvc.restrictedFeatures.has('trainingLHub')
    }
  }

  ngOnInit() {
    if (this.route && this.route.parent) {
      this.routeSubscription = this.route.parent.data.subscribe((data: Data) => {
        this.initData(data)
      })
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
    this.resetAndFetchTocStructure()
    this.getTrainingCount()
  }

  resetAndFetchTocStructure() {
    this.tocStructure = {
      assessment: 0,
      course: 0,
      handsOn: 0,
      interactiveVideo: 0,
      learningModule: 0,
      other: 0,
      pdf: 0,
      podcast: 0,
      quiz: 0,
      video: 0,
      webModule: 0,
      webPage: 0,
      youtube: 0,
    }
    if (this.content) {
      this.hasTocStructure = true
      this.tocStructure.learningModule = this.content.contentType === 'Collection' ? -1 : 0
      this.tocStructure.course = this.content.contentType === 'Course' ? -1 : 0
      this.tocStructure = this.tocSharedSvc.getTocStructure(this.content, this.tocStructure)
      for (const progType in this.tocStructure) {
        if (this.tocStructure[progType] > 0) {
          this.hasTocStructure = true
          break
        }
      }
    }
  }

  // For Learning Hub trainings
  private getTrainingCount() {
    if (
      this.trainingLHubEnabled &&
      this.content &&
      this.trainingSvc.isValidTrainingContent(this.content)
    ) {
      this.trainingLHubCount$ = this.trainingApi
        .getTrainingCount(this.content.identifier)
        .pipe(retry(2))
    }
  }
}
