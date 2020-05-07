/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { NsContent, WidgetContentService } from '@ws-widget/collection'
import { NSQuiz } from '../../plugins/quiz/quiz.model'
import { ActivatedRoute } from '@angular/router'
import { WsEvents, EventService } from '@ws-widget/utils'
@Component({
  selector: 'viewer-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit, OnDestroy {
  private dataSubscription: Subscription | null = null
  private telemetryIntervalSubscription: Subscription | null = null
  isFetchingDataComplete = false
  isErrorOccured = false
  quizData: NsContent.IContent | null = null
  oldData: NsContent.IContent | null = null
  alreadyRaised = false
  quizJson: NSQuiz.IQuiz = {
    timeLimit: 0,
    questions: [],
    isAssessment: false,
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private contentSvc: WidgetContentService,
    private eventSvc: EventService,
  ) { }

  ngOnInit() {
    this.dataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.quizData = data.content.data
        if (this.alreadyRaised && this.oldData) {
          this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.oldData)
        }
        if (this.quizData && this.quizData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.quizData.identifier)
        }
        if (this.quizData) {
          this.quizJson = await this.transformQuiz(this.quizData)
        }
        if (this.quizData) {
          this.oldData = this.quizData
          this.alreadyRaised = true
          this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded, this.quizData)
        }
        this.isFetchingDataComplete = true
      },
      () => {
      },
    )
    // this.telemetryIntervalSubscription = interval(30000).subscribe(() => {
    //   if (this.quizData && this.quizData.identifier) {
    //     this.raiseEvent(WsEvents.EnumTelemetrySubType.HeartBeat)
    //   }
    // })
  }

  ngOnDestroy() {
    if (this.quizData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded, this.quizData)
    }
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
    if (this.telemetryIntervalSubscription) {
      this.telemetryIntervalSubscription.unsubscribe()
    }

  }

  raiseEvent(state: WsEvents.EnumTelemetrySubType, data: NsContent.IContent) {

    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'quiz',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Player,
        mode: WsEvents.WsTimeSpentMode.Play,
        courseId: null,
        content: data,
        identifier: data ? data.identifier : null,
        isCompleted: true,
        mimeType: NsContent.EMimeTypes.QUIZ,
        isIdeal: false,
        url: data ? data.artifactUrl : null,
      },
    }
    this.eventSvc.dispatchEvent(event)

  }

  private async transformQuiz(content: NsContent.IContent): Promise<NSQuiz.IQuiz> {
    const quizJSON: NSQuiz.IQuiz =
      await this.http
        .get<any>(
          content ? content.artifactUrl : '')
        .toPromise()
        .catch((_err: any) => {
          // throw new DataResponseError('MANIFEST_FETCH_FAILED');
        })
    quizJSON.questions.forEach((question: NSQuiz.IQuestion) => {
      if (question.multiSelection && question.questionType === undefined) {
        question.questionType = 'mcq-mca'
      } else if (!question.multiSelection && question.questionType === undefined) {
        question.questionType = 'mcq-sca'
      }
    })
    return quizJSON
  }

  private async setS3Cookie(contentId: string) {
    await this.contentSvc
      .setS3Cookie(contentId)
      .toPromise()
      .catch(() => {
        // throw new DataResponseError('COOKIE_SET_FAILURE')
      })
    return
  }
}
