/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import {
  IContinueLearningData,
  IContinueLearningResponse,
  IHistory
} from '../../models/content.model'
import { IPaginatedApiResponse } from '../../models/paginatedApi.model'
import { processDisplayContentType, processUrl } from '../../utils/contentHelpers'
import { CONSTANTS } from '../../utils/env'
import { getStringifiedQueryParams } from '../../utils/helpers'
import { logError } from '../../utils/logger'
import { ERROR } from '../../utils/message'
import { extractUserIdFromRequest } from '../../utils/requestExtract'
import { getContentDetails } from '../content'

const API_END_POINTS = {
  continueGet: (userId: string) =>
    `${CONSTANTS.SB_EXT_API_BASE_2}/v1/continue/user/${userId}/getdata`,
  continuePut: (userId: string) =>
    `${CONSTANTS.SB_EXT_API_BASE_2}/v1/continue/user/${userId}/putdata`,
}

export const historyApi = Router()

historyApi.get('/', async (req, res) => {
  try {
    const pageState = req.query.pageState
    const pageSize = req.query.pageSize || 50
    const isCompleted = req.query.isCompleted || false
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const queryParams = getStringifiedQueryParams({
      isCompleted,
      pageSize,
      pageState,
    })
    const url = `${API_END_POINTS.continueGet(extractUserIdFromRequest(req))}?${queryParams}`
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        rootOrg,
      },
      method: 'GET',
      url,
    })
    let contents = []
    if (Array.isArray(response.data.results)) {
      contents = response.data.results.map((content: IHistory) => ({
        ...content,
        appIcon: processUrl(content.appIcon),
        artifactUrl: processUrl(content.artifactUrl),
        displayContentType: processDisplayContentType(content.contentType, content.resourceType),
      }))
    }
    const result: IPaginatedApiResponse = {
      contents,
      hasMore: Boolean(response.data.pageState) || false,
      pageState: response.data.pageState,
    }
    res.json(result)
  } catch (err) {
    logError('CONTINUE LEARNING FETCH ERROR >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
historyApi.get('/:contentId', async (req, res) => {
  try {
    const contentId = req.params.contentId
    const queryParams = getStringifiedQueryParams({
      contextPathId: contentId,
    })
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const url = `${API_END_POINTS.continueGet(extractUserIdFromRequest(req))}?${queryParams}`
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        rootOrg,
      },
      method: 'GET',
      url,
    })
    let result: IContinueLearningData | null = null
    if (
      Array.isArray(response.data.results) &&
      response.data.results.length &&
      response.data.results[0]
    ) {
      const continueData: IContinueLearningResponse = response.data.results[0].continueLearningData
      const continueResponse = await getContentDetails(
        continueData.resourceId,
        rootOrg,
        org,
        extractUserIdFromRequest(req),
        'minimal'
      )
      result = {
        ...continueResponse,
        continueData: continueData.data,
      }
    }
    res.json(result)
  } catch (err) {
    logError('CONTINUE LEARNING FETCH FOR CONTENT ERROR >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
// send player continuity
historyApi.post('/continue', async (req, res) => {
  try {
    const url = `${API_END_POINTS.continuePut(extractUserIdFromRequest(req))}`
    const requestBody = {
      ...req.body,
    }
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios({
      ...axiosRequestConfig,
      data: requestBody,
      headers: {
        rootOrg,
      },
      method: 'POST',
      url,
    })
    res.status(response.status).send(response.data)
  } catch (err) {
    logError('CONTINUE LEARNING SET FOR CONTENT ERROR >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
