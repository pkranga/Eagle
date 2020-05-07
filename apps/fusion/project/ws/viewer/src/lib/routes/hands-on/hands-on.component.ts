/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Subscription } from 'rxjs'
import {
  NsContent,
  WidgetContentService,
} from '@ws-widget/collection'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'viewer-hands-on',
  templateUrl: './hands-on.component.html',
  styleUrls: ['./hands-on.component.scss'],
})
export class HandsOnComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  isFetchingDataComplete = false
  isErrorOccured = false
  handsOnData: NsContent.IContent | null = null
  handsOnManifest: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.routeDataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.handsOnData = data.content.data
        if (this.handsOnData && this.handsOnData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.handsOnData.identifier)
        }
        if (this.handsOnData && this.handsOnData.mimeType === NsContent.EMimeTypes.HANDS_ON) {
          this.handsOnManifest = await this.transformHandsOn(this.handsOnData)
        }
        if (this.handsOnData && this.handsOnManifest) {
          this.isFetchingDataComplete = true
        } else {
          this.isErrorOccured = true
        }
      },
      () => {
      },
    )
  }

  ngOnDestroy() {
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe()
    }
  }

  private async transformHandsOn(_content: NsContent.IContent) {
    let manifestFile = ''
    if (this.handsOnData && this.handsOnData.artifactUrl) {
      manifestFile = await this.http
        .get<any>(
          this.handsOnData.artifactUrl,
        )
        .toPromise()
        .catch((_err: any) => {
        })
    }
    return manifestFile
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
