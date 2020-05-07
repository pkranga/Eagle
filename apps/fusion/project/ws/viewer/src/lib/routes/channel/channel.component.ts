/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { NsContent } from '@ws-widget/collection'
import { ActivatedRoute } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { ViewerUtilService } from '../../viewer-util.service'

@Component({
  selector: 'viewer-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit, OnDestroy {

  private routeDataSubscription: Subscription | null = null
  isFetchingDataComplete = false
  isErrorOccured = false
  channelData: NsContent.IContent | null = null
  channelManifest: any
  downloadRegex = new RegExp(`(/content-store/.*?)(\\\)?\\\\?['"])`, 'gm')
  authoringBase = '/apis/authContent/'
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private viewerSvc: ViewerUtilService,
  ) { }

  ngOnInit() {
    this.routeDataSubscription = this.viewerSvc.getContent(this.activatedRoute.snapshot.paramMap.get('resourceId') || '').subscribe(
      async data => {
        this.channelData = data
        this.channelManifest = await this.transformHandsOn(this.channelData)
        if (this.channelData && this.channelManifest) {
          this.isFetchingDataComplete = true
          this.channelManifest = JSON.parse(
            JSON.stringify(this.channelManifest)
              .replace(this.downloadRegex, this.regexDownloadReplace),
          )
        } else {
          this.isErrorOccured = true
        }
      },
      () => {
        this.isErrorOccured = true
      },
    )
  }

  regexDownloadReplace = (_str = '', group1: string, group2: string): string => {
    return `${this.authoringBase}${encodeURIComponent(group1)}${group2}`
  }

  ngOnDestroy() {
    if (this.routeDataSubscription) {
      this.routeDataSubscription.unsubscribe()
    }
  }

  private async transformHandsOn(_content: NsContent.IContent) {
    let manifestFile = null
    if (this.channelData && this.channelData.artifactUrl) {
      manifestFile = await this.http
        .get<any>(
          `${this.authoringBase}${encodeURIComponent(this.channelData.artifactUrl)}`,
        )
        .toPromise()
        .catch((_err: any) => {
        })
    }
    return manifestFile
  }

}
