/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { AnalyticsService } from '../../services/analytics.service'
import { NSAnalyticsData } from '../../models/analytics.model'
import { TFetchStatus } from '@ws-widget/utils'

@Component({
  selector: 'ws-app-learning',
  templateUrl: './learning.component.html',
  styleUrls: ['./learning.component.scss'],
})
export class LearningComponent implements OnInit {
  startDate = '2018-04-01'
  endDate = '2020-03-31'
  contentType = 'Course'
  isCompleted = 0
  nsoFetchStatus: TFetchStatus = 'fetching'
  userFetchStatus: TFetchStatus = 'fetching'
  nsoData: NSAnalyticsData.INsoResponse | null = null
  userProgressData: NSAnalyticsData.IUserProgressResponse | null = null
  constructor(private analyticsSrv: AnalyticsService) { }

  ngOnInit() {
    this.nsoFetchStatus = 'fetching'
    this.userFetchStatus = 'fetching'
    this.analyticsSrv.nsoArtifacts(this.startDate, this.endDate, this.contentType, this.isCompleted).subscribe(
      (nsoResponse: NSAnalyticsData.INsoResponse) => {
        this.nsoData = nsoResponse
        this.nsoFetchStatus = 'done'
      },
      () => {
        this.nsoFetchStatus = 'error'
      })
    this.analyticsSrv.userProgress(this.startDate, this.endDate, this.contentType, this.isCompleted).subscribe(
      (userProgressResponse: NSAnalyticsData.IUserProgressResponse) => {
        this.userProgressData = userProgressResponse
        this.userFetchStatus = 'done'
      },
      () => {
        this.userFetchStatus = 'error'
      })
  }

}
