/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { NSLearningHistory } from '../../models/learning.models'
import { ActivatedRoute } from '@angular/router'
import { LearningHistoryService } from '../../services/learning-history.service'
import { NsContent } from '@ws-widget/collection'
import { AnalyticsService } from '../../../analytics/services/analytics.service'
import { NSAnalyticsData } from '../../../analytics/models/analytics.model'
import { TFetchStatus } from '@ws-widget/utils'
import { PageEvent } from '@angular/material'
interface ILearningHistoryContent {
  content: NSLearningHistory.ILearningHistory
  contentType: string
  pageState: number
  loading: boolean
  isLoadingFirstTime: boolean
  fetchStatus: 'fetching' | 'done' | 'error'
}

@Component({
  selector: 'ws-app-learning-history',
  templateUrl: './learning-history.component.html',
  styleUrls: ['./learning-history.component.scss'],
})
export class LearningHistoryComponent implements OnInit {
  lhCard: NSLearningHistory.ILearningHistoryItem[] = []
  lhContent: ILearningHistoryContent[] = []
  pageState = -1
  learningHistoryData: NSLearningHistory.IResult[] = []
  selectedStatusType: 'inprogress' | 'completed' = 'inprogress'
  selectedTabIndex = 0
  contentTypes = ['learning path', 'course', 'collection', 'resource', 'certification']
  pageSize = 10
  loadingContent = true
  ongoingCertifications: NSLearningHistory.ILearningHistoryItem[] = []
  passedCertifications: NSLearningHistory.ILearningHistoryItem[] = []
  enabledTab = this.route.snapshot.data.pageData.data.enabledTabs.learning.subTabs
  startDate = '2018-04-01'
  endDate = '2020-03-31'
  contentType = 'Course'
  isCompleted = 0
  userFetchStatus: TFetchStatus = 'fetching'
  historyFetchStatus: TFetchStatus = 'fetching'
  getUserLearning = true
  error = false
  loader: any
  myProgress: any
  othersProgress: any
  progressData: any
  page = {
    p1: 0,
    p2: 0,
  }
  progressData1 = [
    { status: false, data: [] }, { status: false, data: [] }, { status: false, data: [] },
  ]
  userProgressData: NSAnalyticsData.IUserProgressResponse | null = null
  historyData: any
  isClient = this.route.snapshot.data.pageData.data.enabledTabs.learning.subTabs.learningHistory.isClient
  constructor(
    private route: ActivatedRoute,
    private learnHstSvc: LearningHistoryService,
    private analyticsSrv: AnalyticsService,
  ) { }

  ngOnInit() {
    if (this.isClient) {
      this.analyticsSrv.userProgress(this.startDate, this.endDate, this.contentType, this.isCompleted).subscribe(
      (userProgressResponse: any) => {
        this.userProgressData = userProgressResponse
        this.othersProgress = userProgressResponse.learning_history_progress_range
        this.myProgress = userProgressResponse.learning_history
        this.getFilteredCourse(0)
      },
      () => {
        this.userFetchStatus = 'error'
      })
    } else {
      this.contentTypes.forEach(contentType => {
        this.lhContent.push({
          contentType,
          content: {
            count: 0,
            page_state: '',
            result: [],
          },
          pageState: 0,
          loading: false,
          isLoadingFirstTime: true,
          fetchStatus: 'fetching',
        })
      })
      this.route.data.subscribe(async data => {
        this.lhCard = data.learningHistory.data.results
        this.lhContent[0].content = data.learningHistory.data
        this.lhContent[0].contentType = 'learning path'
        this.lhContent[0].fetchStatus = 'done'
        this.lhContent[0].loading = false
      })
    }
  }

  // getHistoryData(contentType: string) {
  //   this.learnHstSvc.fetchContentProgress(this.pageState, this.pageSize, this.selectedStatusType, contentType).subscribe(
  //     (data: NSLearningHistory.ILearningHistoryResponse) => {
  //       this.learningHistoryData = data.result
  //       this.historyFetchStatus = 'done'
  //     },
  //     () => {
  //       this.historyFetchStatus = 'done'
  //     },
  //   )
  // }
  getUserProgress(content: ILearningHistoryContent) {
    this.toggleLoading(true, content)

    if (content.contentType !== 'certification') {
      this.learnHstSvc
        .fetchContentProgress(
          content.pageState,
          this.pageSize,
          this.selectedStatusType,
          content.contentType,
        )
        .subscribe((data: NSLearningHistory.ILearningHistory) => {
          content.content.count = data.count

          data.result.forEach((resultObj: any) => {
            content.content.result.push(resultObj)
          })

          content.pageState += 1
          this.toggleLoading(false, content)
        })
    } else {
      if (this.ongoingCertifications.length && this.passedCertifications.length) {
        content.content.result =
          this.selectedStatusType === 'inprogress'
            ? this.ongoingCertifications
            : this.passedCertifications
        this.toggleLoading(false, content)
        return
      }
      this.learnHstSvc.fetchCertification().subscribe(
        (data: NSLearningHistory.ICertification) => {
          // Create the list for ongoing certifications
          this.ongoingCertifications = data.ongoingList.map(cert =>
            this.contentToLearningHistory(cert),
          )
          // Create the list for passed certifications
          this.passedCertifications = data.passedList.map(cert =>
            this.contentToLearningHistory(cert),
          )
          content.content.result =
            this.selectedStatusType === 'inprogress'
              ? this.ongoingCertifications
              : this.passedCertifications
          this.toggleLoading(false, content)
        },
        () => {
          this.toggleLoading(false, content)
        },
      )
    }
  }

  reinitializeHistory() {
    this.lhContent.forEach(content => {
      content.content.count = 0
      content.content.result = []
      content.pageState = 0
      content.loading = false
      content.isLoadingFirstTime = true
      content.fetchStatus = 'fetching'
    })
  }

  onStatusChange() {
    this.selectedStatusType = this.selectedStatusType === 'inprogress' ? 'completed' : 'inprogress'
    this.reinitializeHistory()
    this.getUserProgress(this.lhContent[this.selectedTabIndex])
  }

  toggleLoading(loading: boolean, content: ILearningHistoryContent) {
    if (loading) {
      this.loadingContent = true
      content.loading = true
    } else {
      content.loading = false
      content.isLoadingFirstTime = false
      content.fetchStatus = 'done'

      this.loadingContent = false
    }
  }

  contentToLearningHistory(cert: NsContent.IContent) {
    return {
      identifier: cert.identifier,
      name: cert.name,
      contentType: cert.contentType,
      totalDuration: cert.duration,
      children: cert.children.map(child => child.identifier),
    }
  }

  onTabChange(selectedIndex: number) {
    this.selectedTabIndex = selectedIndex
    if (this.lhContent[selectedIndex].fetchStatus === 'done') {
      return
    }
    this.getUserProgress(this.lhContent[this.selectedTabIndex])
  }
  onTabChangeClient(selectedIndex: number) {
    if (!this.progressData1[selectedIndex].status) {
      this.getFilteredCourse(selectedIndex)
    } else {
      this.progressData1[selectedIndex].status = false
      this.loader = setInterval(() => {
        this.progressData1[selectedIndex].status = true
      },
      // tslint:disable-next-line:align
      500,
    )
      return
    }

  }
  getFilteredCourse(index: number) {
    this.getUserLearning = true
    const contentType = (index === 0 ? 'Resource' : (index === 1) ? 'Module' : 'Course')

    this.analyticsSrv.userProgress(this.startDate, this.endDate, contentType, this.isCompleted).subscribe(
      (history: any) => {
        this.progressData = []
        this.myProgress = history.learning_history
        this.othersProgress = history.learning_history_progress_range
        this.myProgress.map((cur: any, i: any) => {
          const others = this.othersProgress[cur.lex_id]
          if (others.length === 5) {
            const obj: any = {
              name: cur.content_name,
              id: cur.lex_id,
              progress: cur.progress,
              completed: others['0'].doc_count || 0,
              source: cur.source,
              legend: (i === 0) ? true : false,
              data: [
                {
                  y: others['0'].doc_count || 0,
                },
                {
                  y: others['1'].doc_count || 0,
                },
                {
                  y: others['2'].doc_count || 0,
                },
                {
                  y: others['3'].doc_count + others['4'].doc_count || 0,
                },
              ],
            }
            this.progressData.push(obj)
              // if(i)
          }
        })
        this.progressData1[index].data = this.progressData
        this.progressData1[index].status = true
          // this.loader = setInterval( () => {
          //   this.getUserlearning = false;
          // }, 2000);
          // console.log(this.myProgress)
      },
      () => {
        this.error = true
        this.loader = true
        this.userFetchStatus = 'error'
      },
    )
  }
  changePage(event: PageEvent, num: number) {
    if (num === 1) {
      this.page.p1 = event.pageIndex * 10
    } else if (num === 2) {
      this.page.p2 = event.pageIndex * 10
    }
  }
}
