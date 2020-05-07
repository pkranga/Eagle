/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsContent } from './widget-content.model'

export namespace NSSearch {
  export interface IFeatureSearchConfig {
    tabs: IConfigContentStrip[]
  }
  export interface IFilterSearchRequest {
    contentType?: NsContent.EContentTypes[]
    creatorContacts?: string[]
    labels?: string[]
    resourceCategory?: string[]
    catalogPaths?: string[]
  }
  export interface ISearchRequest {
    filters?: IFilterSearchRequest
    query?: string
    isStandAlone?: boolean
    instanceCatalog?: boolean
    locale?: string[]
    pageNo?: number
    pageSize?: number
    uuid?: string
    rootOrg?: string
    // sort?: { lastUpdatedOn: 'desc' | 'asc' }[]
    sort?: { [key: string]: string }[]
  }

  export interface ISearchOrgRegionRecommendationRequest extends ISearchRequest {
    defaultLabel?: string
    preLabelValue?: string
  }

  export interface ISearchV6Request {
    visibleFilters?: ISearchV6VisibleFilters
    excludeSourceFields?: string[]
    includeSourceFields?: string[]
    sort?: any[]
    query: string
    sourceFields?: string[]
    locale?: string[]
    pageNo?: number
    pageSize?: number
    filters?: ISearchV6Filters[]
    isStandAlone?: boolean
  }

  interface ISearchV6VisibleFilters {
    [key: string]: {
      displayName: string,
      order?: { [key: string]: 'asc' | 'desc' }[],
    }
  }

  interface ISearchV6Filters {
    andFilters?: { [key: string]: string[] }[]
    notFilters?: { [key: string]: string[] }[]
  }
  export interface ISearchRedirection {
    f?: {
      [index: string]: string[],
    }
    q?: string
    tab?: string
  }
  export interface IConfigContentStrip {
    titleKey?: string
    title?: string
    reqRoles?: string[]
    reqFeatures?: string[]
    searchRedirection?: ISearchRedirection
    searchQuery?: ISearchRequest
    contentIds?: string[]
  }
  export interface ISearchApiResult {
    totalHits: number
    result: NsContent.IContent[]
    filters: IFilterUnitResponse[]
    notToBeShownFilters?: IFilterUnitResponse[]
    filtersUsed: string[]
  }
  export interface ISearchV6ApiResult {
    totalHits: number
    result: NsContent.IContent[]
    filtersUsed: string[]
    notVisibleFilters: string[]
    filters: IFilterUnitResponse[]
    queryUsed?: string
  }
  export interface IFilterUnitResponse {
    id?: string
    type: string
    displayName: string
    content: IFilterUnitContent[]
  }
  export interface IFilterUnitContent {
    type?: string
    id?: string
    displayName: string
    count: number
    children?: IFilterUnitContent[]
  }
  export interface ITypeUnitResponse {
    displayName: string
    type: string
    count: string
  }
}
