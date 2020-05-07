/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Subscription } from 'rxjs'

import { ConfigurationsService, NsPage } from '@ws-widget/utils'
import { EFeedbackType } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnDestroy {
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  feedbackType?: EFeedbackType
  feedbackTypes: typeof EFeedbackType
  private queryParamSub?: Subscription

  constructor(private configSvc: ConfigurationsService, private route: ActivatedRoute) {
    this.pageNavbar = this.configSvc.pageNavBar
    this.feedbackTypes = EFeedbackType

    this.queryParamSub = this.route.queryParamMap.subscribe(queryParams => {
      const feedbackType = queryParams.get('feedbackType') as EFeedbackType
      if (feedbackType) {
        this.feedbackType = feedbackType
      } else {
        this.feedbackType = undefined
      }
    })
  }

  ngOnDestroy() {
    if (this.queryParamSub && !this.queryParamSub.closed) {
      this.queryParamSub.unsubscribe()
    }
  }
}
