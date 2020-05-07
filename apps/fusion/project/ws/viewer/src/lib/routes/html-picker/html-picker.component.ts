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
  selector: 'viewer-html-picker',
  templateUrl: './html-picker.component.html',
  styleUrls: ['./html-picker.component.scss'],
})
export class HtmlPickerComponent implements OnInit, OnDestroy {

  private routeDataSubscription: Subscription | null = null
  isFetchingDataComplete = false
  isErrorOccured = false
  htmlPickerData: NsContent.IContent | null = null
  htmlPickerManifest: any
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private contentSvc: WidgetContentService,
  ) { }

  ngOnInit() {
    this.routeDataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.htmlPickerData = data.content.data
        if (this.htmlPickerData && this.htmlPickerData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.htmlPickerData.identifier)
        }
        if (this.htmlPickerData && this.htmlPickerData.mimeType === NsContent.EMimeTypes.HTML_PICKER) {
          this.htmlPickerManifest = await this.transformHandsOn(this.htmlPickerData)
        }
        if (this.htmlPickerData && this.htmlPickerManifest) {
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
    if (this.htmlPickerData && this.htmlPickerData.artifactUrl) {
      manifestFile = await this.http
        .get<any>(
          this.htmlPickerData.artifactUrl,
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
