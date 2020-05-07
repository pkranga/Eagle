/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from './../../utils/env'

interface IContentLocal {
  identifier: string
  locale: string
}

export async function searchForOtherLanguage(
  query: string,
  uuid: string,
  rootOrg: string
): Promise<string[]> {
  const searchBody = {
    request: {
      filters: { status: ['Draft', 'InReview', 'Reviewed', 'QualityReview', 'Live'] },
      query,
      rootOrg,
      uuid,
    },
  }

  try {
    const v = await axios.post(
      `${CONSTANTS.SB_EXT_API_BASE}/authsearch5`,
      searchBody,
      axiosRequestConfig
    )
    const result: string[] = [query]
    if (v.data.result && v.data.result.response && v.data.result.response.result) {
      const resultContent = v.data.result.response.result.find(
        (content: { identifier: string }) => content.identifier === query
      )
      if (resultContent) {
        const searchList = ['hasTranslations', 'isTranslationOf']
        searchList.forEach((meta) => {
          if (resultContent[meta] && resultContent[meta].length) {
            resultContent[meta].forEach((data: IContentLocal) => {
              result.push(data.identifier)
            })
          }
        })
      }
    }
    return result
  } catch (ex) {
    return [query]
  }
}
