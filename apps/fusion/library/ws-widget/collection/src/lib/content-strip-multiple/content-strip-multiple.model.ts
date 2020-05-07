/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsWidgetResolver } from '@ws-widget/resolver'
import { NSSearch } from '../_services/widget-search.model'
import { NsContent } from '../_services/widget-content.model'
import { NsCardContent } from '../card-content/card-content.model'

export namespace NsContentStripMultiple {
  export interface IContentStripMultiple {
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    strips: IContentStripUnit[]
  }
  export interface IContentStripUnit {
    key: string
    title: string
    info?: IStripInfo
    preWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    postWidgets?: NsWidgetResolver.IRenderConfigWithAnyData[]
    stripConfig?: IStripConfig
    canHideStrip?: boolean
    filters?: any[]
    request?: {
      search?: NSSearch.ISearchRequest
      searchV6?: NSSearch.ISearchV6Request
      searchRegionRecommendation?: NSSearch.ISearchOrgRegionRecommendationRequest
      api?: IStripRequestApi
      ids?: string[],
    }
    searchV6Type?: 'KB' | 'Collections' | null
    stripBackground?: string
    noDataWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    loader?: boolean
    errorWidget?: NsWidgetResolver.IRenderConfigWithAnyData
    refreshEvent?: Record<'eventType' | 'from', string>
    fetchLikes?: boolean
  }
  export interface IStripRequestApi {
    path: string
    queryParams?: {
      pageNo?: number
      pageSize?: number
      pageState?: string,
    }
  }
  export interface IStripInfo {
    mode: 'below' | 'popup' | 'modal'
    visibilityMode?: 'hidden' | 'visible'
    icon: {
      icon: string
      scale: number
      style?: any, // added for UI
    }
    widget: NsWidgetResolver.IRenderConfigWithAnyData
  }
  interface IStripConfig {
    // card subType key is used to determine the content Card display type
    cardSubType: NsCardContent.TCardSubType
    // to show view more card for a search strip
    postCardForSearch?: boolean
    intranetMode?: 'greyOut' | 'hide'
    deletedMode?: 'greyOut' | 'hide'
  }
  export interface IContentStripResponseApi {
    contents: NsContent.IContent[]
    hasMore?: boolean
    pageState?: string
    totalHits?: number
  }
}
