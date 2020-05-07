/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { IContent, TLearningMode, TContentType } from './content.model';

// Search Request
export interface IFilterUnitItem {
  type?: string;
  id?: string;
  displayName: string;
  count: number;
  children?: IFilterUnitItem[];
  // added for UI
  checked?: boolean;
  from?: string;
  to?: string;
  isExpanded?: boolean;
}
export interface IFilterUnitResponse {
  id?: string;
  type: string;
  displayName: string;
  content: IFilterUnitItem[];
  // added for UI
  checked?: boolean;
}
export interface ITypeUnitResponse {
  displayName: string;
  type: string;
  count: string;
}
export interface ISearchRequestFilter {
  [type: string]: string[];
}

// Search Response
export interface ISearchApiResponse {
  response: ISearchApiResult;
}
export interface ISearchApiResult {
  totalHits: number;
  result: IContent[];
  filters: IFilterUnitResponse[];
  type: ITypeUnitResponse[];
}

export interface ISearchRequest {
  // making userAgent and query optional(NOT IN ACTUAL) for passing data
  userAgent?: string;
  query?: string;
  pageNo: number;
  pageSize?: number;
  filters?: {
    // [type: string]: string[];
    categories?: string[];
    contentType?: TContentType[];
    keywords?: string[];
    learningMode?: TLearningMode[];
    resourceCategory?: string[];
    subTracks?: string[];
    tags?: string[];
    tracks?: string[];
  };
  sortBy?: string;
  sortOrder?: string;

  siemensCatalog?: boolean;
  isStandAlone?: boolean;
}

export interface ISearchResponse {
  totalHits: number;
  result: IContent[];
  filters: ISearchFilter[];
}

/**
 * Level 1 always has count.
 * Level 1 count is always null. rest has count
 * id values is not present in most cases
 */
export interface ISearchFilter {
  id?: string;
  type: string;
  displayName: string;
  count?: number;
  content?: ISearchFilter[];
  children?: ISearchFilter[];

  // for UI
  isExpanded?: boolean;
}
