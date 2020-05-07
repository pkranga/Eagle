/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { noop } from 'rxjs'
import {
  IFeedbackThread,
  EFeedbackType,
  IFeedbackConfig,
  FeedbackService,
  EFeedbackRole,
  NsContent,
} from '@ws-widget/collection'
import { IResolveResponse, ConfigurationsService } from '@ws-widget/utils'

@Component({
  selector: 'ws-app-feedback-thread-header',
  templateUrl: './feedback-thread-header.component.html',
  styleUrls: ['./feedback-thread-header.component.scss'],
})
export class FeedbackThreadHeaderComponent implements OnInit {
  @Input() threadHead!: IFeedbackThread
  @Input() viewedBy!: EFeedbackRole
  feedbackTypes: typeof EFeedbackType
  feedbackRoles: typeof EFeedbackRole
  contentTypes: typeof NsContent.EContentTypes
  feedbackConfig!: IFeedbackConfig
  feedbackCategory?: string
  readonly userId?: string

  constructor(
    private feedbackApi: FeedbackService,
    private route: ActivatedRoute,
    private configSvc: ConfigurationsService,
  ) {
    const userProfile = this.configSvc.userProfile
    if (userProfile) {
      this.userId = userProfile.userId
    }

    this.feedbackTypes = EFeedbackType
    this.feedbackRoles = EFeedbackRole
    this.contentTypes = NsContent.EContentTypes

    const feedbackConfigResolve = this.route.snapshot.data['feedbackConfig'] as IResolveResponse<
      IFeedbackConfig
    >
    if (feedbackConfigResolve && feedbackConfigResolve.data) {
      this.feedbackConfig = feedbackConfigResolve.data
    }
  }

  ngOnInit() {
    this.feedbackCategory = this.threadHead.feedbackCategory
  }

  updateCategory(category: string) {
    this.feedbackApi
      .updateFeedbackStatus(this.threadHead.rootFeedbackId, category)
      .subscribe(threadItem => {
        this.feedbackCategory = threadItem.feedbackCategory
      },         noop)
  }
}
