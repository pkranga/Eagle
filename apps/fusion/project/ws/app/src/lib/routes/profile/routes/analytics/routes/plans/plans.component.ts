/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { AnalyticsService } from '../../services/analytics.service'
import { NSAnalyticsData } from '../../models/analytics.model'
import { TFetchStatus } from '@ws-widget/utils'
@Component({
  selector: 'ws-app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss'],
})
export class PlansComponent implements OnInit {
  startDate = '2018-04-01'
  endDate = '2020-03-31'
  contentType = 'Course'
  isCompleted = 0
  userFetchStatus: TFetchStatus = 'fetching'
  userProgressData: NSAnalyticsData.IUserProgressResponse | null = null
  constructor(private analyticsSrv: AnalyticsService) { }

  ngOnInit() {
    this.userFetchStatus = 'fetching'
    this.analyticsSrv.userProgress(this.startDate, this.endDate, this.contentType, this.isCompleted).subscribe(
      (userProgressResponse: NSAnalyticsData.IUserProgressResponse) => {
        this.userProgressData = userProgressResponse
        this.userFetchStatus = 'done'
      },
      () => {
        this.userFetchStatus = 'error'
      },
    )
  }

}
