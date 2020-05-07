/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { IContent } from '../models/content.model'
import { IPaginatedApiResponse } from '../models/paginatedApi.model'
import { processContent } from '../utils/contentHelpers'
import { CONSTANTS } from '../utils/env'
import { getStringifiedQueryParams } from '../utils/helpers'
import { logError } from '../utils/logger'
import { ERROR } from '../utils/message'
import { extractUserEmailFromRequest, extractUserIdFromRequest } from '../utils/requestExtract'

const API_END_POINTS = {
  interest: (userId: string) => `${CONSTANTS.SB_EXT_API_BASE}/${userId}/recommendations/interest`,
  recommendations: CONSTANTS.SB_EXT_API_BASE,
  usage: CONSTANTS.SB_EXT_API_BASE + '/v1/recommendation',
}

export const recommendationApi = Router()

recommendationApi.get('/', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    const langCode = req.header('locale')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const filters = req.query.filters
    let decodedFilters = {
      recommendationCategory: 'org',
    }
    if (filters) {
      decodedFilters = JSON.parse(decodeURIComponent(filters))
    }
    const recommendationCategory = decodedFilters.recommendationCategory
    // tslint:disable-next-line: max-line-length
    const url = `${API_END_POINTS.recommendations}/${extractUserIdFromRequest(req)}/recommendations?type=${recommendationCategory}`
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        langCode,
        org,
        rootOrg,
      },
      method: 'GET',
      url,
    })
    let contents: IContent[] = []
    if (Array.isArray(response.data.result && response.data.result.response && response.data.result.response.result)) {
      contents = response.data.result.response.result.map((content: IContent) => processContent(content))
    }
    const result: IPaginatedApiResponse = {
      contents,
      hasMore: false,
    }
    res.json(result)
  } catch (error) {
    logError('RECOMMENDATIONS FETCH ERROR >', error)
    res.status(500).json(error)
  }
})

recommendationApi.get('/interestBased', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    const langCode = req.header('langCode') || 'en'
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const pageNo = req.query.pageNo || 0
    const pageSize = req.query.pageSize || 20
    const queryParams = getStringifiedQueryParams({
      pageNumber: pageNo,
      pageSize,
    })
    const url = `${API_END_POINTS.interest(extractUserIdFromRequest(req))}?${queryParams}`
    const response = await axios.get(url, {
      ...axiosRequestConfig,
      headers: {
        langCode,
        locale: langCode,
        org,
        rootOrg,
      },
    })
    const recommendations = (
      response.data &&
      response.data.result &&
      response.data.result.response &&
      response.data.result.response.result
    ) || []
    const result: IPaginatedApiResponse = {
      contents: recommendations.map((recommendation: IContent) => processContent(recommendation)) || [],
      hasMore: false,
    }
    res.json(result)
  } catch (error) {
    logError('INTEREST BASED RECOMMENDATIONS FETCH ERROR >', error)
    res.status(500).json(error)
  }
})

recommendationApi.get('/usageBased', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    const langCode = req.header('locale')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const pageNo = req.query.pageNo || 0
    const pageSize = req.query.pageSize || 20
    const queryParams = getStringifiedQueryParams({
      pageNumber: pageNo,
      resourceCount: pageSize,
      userId: extractUserIdFromRequest(req),
    })
    const url = `${API_END_POINTS.usage}/${extractUserEmailFromRequest(req)}/usage?${queryParams}`
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        langCode,
        org,
        rootOrg,
      },
      method: 'GET',
      url,
    })
    const recommendations = (response.data && response.data.result && response.data.result.response) || []
    const result: IPaginatedApiResponse = {
      contents: recommendations.map((recommendation: IContent) => processContent(recommendation)) || [],
      hasMore: false,
    }
    res.json(result)
  } catch (error) {
    logError('USAGE BASED RECOMMENDATIONS FETCH ERROR >', error)
    res.status(500).json(error)
  }
})

recommendationApi.get('/:recommendationType', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    const langCode = req.header('locale')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const filters = req.query.filters
    let decodedFilters = {
      recommendationCategory: 'org',
    }
    if (filters) {
      decodedFilters = JSON.parse(decodeURIComponent(filters))
    }
    const recommendationCategory = decodedFilters.recommendationCategory
    const pageNo = req.query.pageNo || 0
    const pageSize = req.query.pageSize || 20
    const recommendationType = req.params.recommendationType
    // tslint:disable-next-line: max-line-length
    let url = `${API_END_POINTS.recommendations}/${extractUserIdFromRequest(req)}/recommendations/${recommendationType}?type=${recommendationCategory}&pageNumber=${pageNo}&pageSize=${pageSize}`
    if (recommendationType === 'latest') {
      url += '&learningMode=Self-Paced'
    }
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        langCode,
        org,
        rootOrg,
      },
      method: 'GET',
      url,
    })
    let contents: IContent[] = []
    if (Array.isArray(response.data.result && response.data.result.response)) {
      contents = response.data.result.response.map((content: IContent) => processContent(content))
    }
    const result: IPaginatedApiResponse = {
      contents,
      hasMore: false,
    }
    res.json(result)
  } catch (error) {
    logError('RECOMMENDATIONS TYPE FETCH ERROR >', error)
    res.status(500).json(error)
  }
})
