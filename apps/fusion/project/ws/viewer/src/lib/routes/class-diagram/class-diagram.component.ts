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
import { ValueService } from '@ws-widget/utils'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'viewer-class-diagram',
  templateUrl: './class-diagram.component.html',
  styleUrls: ['./class-diagram.component.scss'],
})
export class ClassDiagramComponent implements OnInit, OnDestroy {
  private routeDataSubscription: Subscription | null = null
  private isSmallSubscription: Subscription | null = null
  private isLtMedium$ = this.valueSvc.isLtMedium$
  public isLtMedium = false
  isFetchingDataComplete = false
  isErrorOccured = false
  classDiagramData: NsContent.IContent | null = null
  classDiagramManifest: any

  constructor(
    private activatedRoute: ActivatedRoute,
    private contentSvc: WidgetContentService,
    private http: HttpClient,
    private valueSvc: ValueService,
  ) { }

  ngOnInit() {
    this.isSmallSubscription = this.isLtMedium$.subscribe(isSmall => {
      this.isLtMedium = isSmall
    })

    this.routeDataSubscription = this.activatedRoute.data.subscribe(
      async data => {
        this.classDiagramData = data.content.data
        if (this.classDiagramData && this.classDiagramData.artifactUrl.indexOf('content-store') >= 0) {
          await this.setS3Cookie(this.classDiagramData.identifier)
        }
        if (this.classDiagramData && this.classDiagramData.mimeType === NsContent.EMimeTypes.CLASS_DIAGRAM) {
          this.classDiagramManifest = await this.transformClassDiagram(this.classDiagramData)
        }
        if (this.classDiagramData && this.classDiagramManifest) {
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
    if (this.isSmallSubscription) {
      this.isSmallSubscription.unsubscribe()
    }
  }

  private async transformClassDiagram(_content: NsContent.IContent) {
    let manifestFile = ''
    if (this.classDiagramData && this.classDiagramData.artifactUrl) {
      manifestFile = await this.http
        .get<any>(
          this.classDiagramData.artifactUrl,
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
