/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { CONSTANTS } from '../../utils/env'
import { logError } from '../../utils/logger'
import { axiosRequestConfig } from './../../configs/request.config'
import { ISearchResponse } from './../models/response/search-model'

/*
  Description.
    The below function is used to fetch other are created in different in language for the
    provided content. By hitting the search api which query as contentId and extract the other
    language contents from 'isTranslation' and 'hasTranslation' field from search result
    matching the content id

  @param {string} query
    Content for which equivalent other language content needs to be fetched
  @param {string} uuid
    Id of the user for search api to apply access restriction
  @param {string} rootOrg=Infosys
    rootOrg for search api to apply access restriction. Be default point to Infosys

  @return {Array<string>}
    Array of all related content in different language including the provided content as first
    element in array. If the length is one we have to assume either search is failed or the
    content have relation in other language
*/
export const fetchTranslatedContents = async (
  query: string,
  uuid: string,
  rootOrg = 'Infosys'
): Promise<string[]> => {
  // Generating search request body
  const searchBody = {
    request: {
      query,
      rootOrg,
      uuid,
    },
  }
    // Creatting
  const ids: string[] = [query]
  try {
    const result: ISearchResponse = await axios.post(
      CONSTANTS.SB_EXT_API_BASE + '/authsearch5',
      searchBody,
      axiosRequestConfig
    )
    const data =
      result && result.result && result.result.response && result.result.response.result
        ? result.result.response.result
        : null
    if (data && data.length) {
      const requiredContent = data.find((v) => v.identifier === query)
      if (requiredContent) {
        if (requiredContent.isTranslationOf && requiredContent.isTranslationOf.length) {
          requiredContent.isTranslationOf.forEach((v) => ids.push(v.identifier))
        }
        if (requiredContent.hasTranslations && requiredContent.hasTranslations.length) {
          requiredContent.hasTranslations.forEach((v) => ids.push(v.identifier))
        }
      }
    }
  } catch (ex) {
    logError('Authoring tool Search for related content failed. Error : ' + JSON.stringify(ex))
  }
  // Returning the list of ids related to the content including the own content
  return ids
}
