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
  selector: 'viewer-rdbms-hands-on',
  templateUrl: './rdbms-hands-on.component.html',
  styleUrls: ['./rdbms-hands-on.component.scss'],
})
export class RdbmsHandsOnComponent implements OnInit, OnDestroy {

  private dataSubscription: Subscription | null = null
  isFetchingDataComplete = false
  isErrorOccured = false
  rDbmsHandsOnData: NsContent.IContent | null = null
  rDbmsHandsOnManifest: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.dataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.rDbmsHandsOnData = data.content.data
        if (this.rDbmsHandsOnData && this.rDbmsHandsOnData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.rDbmsHandsOnData.identifier)
        }
        if (this.rDbmsHandsOnData && this.rDbmsHandsOnData.mimeType === NsContent.EMimeTypes.RDBMS_HANDS_ON) {
          this.rDbmsHandsOnManifest = await this.transformRDbmsModule(this.rDbmsHandsOnData)
        }
        if (this.rDbmsHandsOnData && this.rDbmsHandsOnManifest) {
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
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe()
    }
  }

  private async transformRDbmsModule(_content: NsContent.IContent) {
    let manifestFile = ''
    if (this.rDbmsHandsOnData && this.rDbmsHandsOnData.artifactUrl) {
      manifestFile = await this.http
        .get<any>(
          this.rDbmsHandsOnData.artifactUrl,
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
