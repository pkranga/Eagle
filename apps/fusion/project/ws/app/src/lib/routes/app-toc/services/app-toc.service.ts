/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { Data } from '@angular/router'
import { Subject, Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { NsContent } from '@ws-widget/collection/src/lib/_services/widget-content.model'
import { NsContentConstants } from '@ws-widget/collection/src/lib/_constants/widget-content.constants'
import { NsAppToc, NsCohorts } from '../models/app-toc.model'
import { TFetchStatus, ConfigurationsService } from '@ws-widget/utils'

// TODO: move this in some common place
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const PROXY_SLAG_V8 = '/apis/proxies/v8'

const API_END_POINTS = {
  CONTENT_PARENTS: `${PROTECTED_SLAG_V8}/content/parents`,
  CONTENT_NEXT: `${PROTECTED_SLAG_V8}/content/next`,
  COHORTS: (cohortType: NsCohorts.ECohortTypes, contentId: string) =>
    `${PROTECTED_SLAG_V8}/cohorts/${cohortType}/${contentId}`,
  EXTERNAL_CONTENT: (contentId: string) =>
    `${PROTECTED_SLAG_V8}/content/external-access/${contentId}`,
}

@Injectable()
export class AppTocService {
  analyticsReplaySubject: Subject<any> = new Subject()
  analyticsFetchStatus: TFetchStatus = 'none'
  private showSubtitleOnBanners = false
  private canShowDescription = false
  constructor(
    private http: HttpClient,
    private configSvc: ConfigurationsService,
  ) { }

  get subtitleOnBanners(): boolean {
    return this.showSubtitleOnBanners
  }
  set subtitleOnBanners(val: boolean) {
    this.showSubtitleOnBanners = val
  }
  get showDescription(): boolean {
    return this.canShowDescription
  }
  set showDescription(val: boolean) {
    this.canShowDescription = val
  }

  showStartButton(content: NsContent.IContent | null): { show: boolean, msg: string } {
    const status = {
      show: false,
      msg: '',
    }
    if (content) {
      if (content.artifactUrl.match(/youtu(.)?be/gi) && this.configSvc.userProfile &&
        this.configSvc.userProfile.country === 'China') {
        status.show = false
        status.msg = 'youtubeForbidden'
        return status
      }
      if (content.resourceType !== 'Certification') {
        status.show = true
        return status
      }
    }
    return status
  }

  initData(data: Data): NsAppToc.IWsTocResponse {
    let content: NsContent.IContent | null = null
    let errorCode: NsAppToc.EWsTocErrorCode | null = null
    if (data.content && data.content.data && data.content.data.identifier) {
      content = data.content.data
    } else {
      if (data.error) {
        errorCode = NsAppToc.EWsTocErrorCode.API_FAILURE
      } else {
        errorCode = NsAppToc.EWsTocErrorCode.NO_DATA
      }
    }
    return {
      content,
      errorCode,
    }
  }

  getTocStructure(
    content: NsContent.IContent,
    tocStructure: NsAppToc.ITocStructure,
  ): NsAppToc.ITocStructure {
    if (
      content &&
      !(content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact')
    ) {
      if (content.contentType === 'Course') {
        tocStructure.course += 1
      } else if (content.contentType === 'Collection') {
        tocStructure.learningModule += 1
      }
      content.children.forEach(child => {
        // tslint:disable-next-line: no-parameter-reassignment
        tocStructure = this.getTocStructure(child, tocStructure)
      })
    } else if (
      content &&
      (content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact')
    ) {
      switch (content.mimeType) {
        case NsContent.EMimeTypes.HANDS_ON:
          tocStructure.handsOn += 1
          break
        case NsContent.EMimeTypes.MP3:
          tocStructure.podcast += 1
          break
        case NsContent.EMimeTypes.MP4:
        case NsContent.EMimeTypes.M3U8:
          tocStructure.video += 1
          break
        case NsContent.EMimeTypes.INTERACTION:
          tocStructure.interactiveVideo += 1
          break
        case NsContent.EMimeTypes.PDF:
          tocStructure.pdf += 1
          break
        case NsContent.EMimeTypes.HTML:
          tocStructure.webPage += 1
          break
        case NsContent.EMimeTypes.QUIZ:
          if (content.resourceType === 'Assessment') {
            tocStructure.assessment += 1
          } else {
            tocStructure.quiz += 1
          }
          break
        case NsContent.EMimeTypes.WEB_MODULE:
          tocStructure.webModule += 1
          break
        case NsContent.EMimeTypes.YOUTUBE:
          tocStructure.youtube += 1
          break
        default:
          tocStructure.other += 1
          break
      }
      return tocStructure
    }
    return tocStructure
  }

  filterToc(
    content: NsContent.IContent,
    filterCategory: NsContent.EFilterCategory = NsContent.EFilterCategory.ALL,
  ): NsContent.IContent | null {
    if (content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact') {
      return this.filterUnitContent(content, filterCategory) ? content : null
    }
    const filteredChildren: NsContent.IContent[] = content.children
      .map(childContent => this.filterToc(childContent, filterCategory))
      .filter(unitContent => Boolean(unitContent)) as NsContent.IContent[]
    if (filteredChildren && filteredChildren.length) {
      return {
        ...content,
        children: filteredChildren,
      }
    }
    return null
  }

  filterUnitContent(
    content: NsContent.IContent,
    filterCategory: NsContent.EFilterCategory = NsContent.EFilterCategory.ALL,
  ): boolean {
    switch (filterCategory) {
      case NsContent.EFilterCategory.LEARN:
        return (
          !NsContentConstants.VALID_PRACTICE_RESOURCES.has(content.resourceType) &&
          !NsContentConstants.VALID_ASSESSMENT_RESOURCES.has(content.resourceType)
        )
      case NsContent.EFilterCategory.PRACTICE:
        return NsContentConstants.VALID_PRACTICE_RESOURCES.has(content.resourceType)
      case NsContent.EFilterCategory.ASSESS:
        return NsContentConstants.VALID_ASSESSMENT_RESOURCES.has(content.resourceType)
      case NsContent.EFilterCategory.ALL:
      default:
        return true
    }
  }
  fetchContentAnalyticsClientData(contentId: string) {
    if (this.analyticsFetchStatus !== 'fetching' && this.analyticsFetchStatus !== 'done') {
      this.getContentAnalyticsClient(contentId)
    }
  }
  private getContentAnalyticsClient(contentId: string) {
    this.analyticsFetchStatus = 'fetching'
    const url = `${PROXY_SLAG_V8}/LA/api/la/contentanalytics?content_id=${contentId}&type=course`
    this.http
      .get(url)
      .subscribe(
        result => {
          this.analyticsFetchStatus = 'done'
          this.analyticsReplaySubject.next(result)
        },
        () => {
          this.analyticsReplaySubject.next(null)
          this.analyticsFetchStatus = 'done'
        },
      )
  }

  fetchContentAnalyticsData(contentId: string) {
    if (this.analyticsFetchStatus !== 'fetching' && this.analyticsFetchStatus !== 'done') {
      this.getContentAnalytics(contentId)
    }
  }
  private getContentAnalytics(contentId: string) {
    this.analyticsFetchStatus = 'fetching'
    // tslint:disable-next-line: max-line-length
path
    this.http
      .get(url)
      .subscribe(
        result => {
          this.analyticsFetchStatus = 'done'
          this.analyticsReplaySubject.next(result)
        },
        () => {
          this.analyticsReplaySubject.next(null)
          this.analyticsFetchStatus = 'done'
        },
      )
  }

  clearAnalyticsData() {
    if (this.analyticsReplaySubject) {
      this.analyticsReplaySubject.unsubscribe()
    }
  }
  private get endDate() {
    return `${new Date().getFullYear()}-${`0${new Date().getMonth() + 1}`.slice(
      -2,
    )}-${`0${new Date().getDate()}`.slice(-2)}`
  }
  private get startDate() {
    return `2018-04-01`
  }

  fetchContentParents(contentId: string): Observable<NsContent.IContentMinimal[]> {
    return this.http.get<NsContent.IContentMinimal[]>(
      `${API_END_POINTS.CONTENT_PARENTS}/${contentId}`,
    )
  }
  fetchContentWhatsNext(contentId: string, contentType?: string): Observable<NsContent.IContentMinimal[]> {
    if (contentType) {
      return this.http.get<NsContent.IContentMinimal[]>(`${API_END_POINTS.CONTENT_NEXT}/${contentId}?contentType=${contentType}`)
    }
    return this.http.get<NsContent.IContentMinimal[]>(`${API_END_POINTS.CONTENT_NEXT}/${contentId}`)

  }
  fetchContentCohorts(
    cohortType: NsCohorts.ECohortTypes,
    contentId: string,
  ): Observable<NsCohorts.ICohortsContent[]> {
    return this.http.get<NsCohorts.ICohortsContent[]>(API_END_POINTS.COHORTS(cohortType, contentId))
  }
  fetchExternalContentAccess(contentId: string): Observable<{ hasAccess: boolean }> {
    return this.http.get<{ hasAccess: boolean }>(API_END_POINTS.EXTERNAL_CONTENT(contentId))
  }
}
