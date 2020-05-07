/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IFilterUnitContent, IFilterUnitResponse } from '../models/catalog.model'
import { searchV5 } from '../protectedApi_v8/content'

export async function getFilters(userId: string, rootOrg: string, type: string, locale: string[]) {
  const requestBody = {
    request: {
      isStandAlone: true,
      locale,
      pageNo: 0,
      pageSize: 0,
      query: '*',
      rootOrg,
      uuid: userId,
    },
  }

  const response = await searchV5(requestBody)
  const catalogPaths = response.filters
    .find((filter: IFilterUnitResponse) => filter.type === type)

  if (catalogPaths) {
    return catalogPaths.content
  }
  return []
}

export function getFilterUnitByType(filter: IFilterUnitContent | undefined, type: string): IFilterUnitContent | null {
  if (filter && filter.type === type) {
    return filter
  } else if (filter && filter.children != null) {
    let result = null
    for (let i = 0; result == null && i < filter.children.length; i++) {
      result = getFilterUnitByType(filter.children[i], type)
    }
    return result
  }
  return null
}
