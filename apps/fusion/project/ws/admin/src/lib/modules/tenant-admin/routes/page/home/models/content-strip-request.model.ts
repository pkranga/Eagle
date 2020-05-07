/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export namespace NsContentStripRequest {
  export enum EContentStripRequestTypes {
    SEARCH_REQUEST = 'searchRequest',
    API_REQUEST = 'apiRequest',
    IDS = 'idsRequest',
  }

  export enum ESearchSortOrderTypes {
    ASCENDING = 'ASC',
    DESCENDING = 'DESC',
  }

  export enum ESearchSortByTypes {
    LAST_UPDATED_ON = 'lastUpdatedOn',
    VALUE1 = 'value1',
    VALUE2 = 'value2',
  }
}
