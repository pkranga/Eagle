/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Request, Response, Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { getStringifiedQueryParams } from '../../utils/helpers'
import { ERROR } from '../../utils/message'
import {
  extractUserIdFromRequest
} from '../../utils/requestExtract'

const apiEndpoints = {
  analytics: CONSTANTS.USER_ANALYTICS,
  childProgress:
    CONSTANTS.TELEMETRY_API_BASE + '/user/dashboard/courses/details',
  dashboard: CONSTANTS.TELEMETRY_API_BASE + '/user/dashboard',
  progress: CONSTANTS.SB_EXT_API_BASE + '/v2/users',
  progress_history: CONSTANTS.SB_EXT_API_BASE_3 + '/v3/users',
  timeSpent: CONSTANTS.SB_EXT_API_BASE_2 + '/v3/users',
}

export const dashboardApi = Router()

dashboardApi.post('/course/details', async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const learningHistoryItems = await axios
      .post(
        `${apiEndpoints.progress_history}/${userId}/dashboard/courses/details`,
        req.body,
        {
          headers: {
            Authorization: req.headers.authorization,
            rootOrg: req.header('rootOrg'),
          },
        }
      )
      .then((response) => response.data)

    return res.send(learningHistoryItems)
  } catch (err) {
    return res
      .status((err && err.response && err.response.status) || 500)
      .send(err)
  }
})

dashboardApi.get(
  '/analytics/progress/:contentType',
  async (req: Request, res) => {
    const { startDate, endDate, isCompleted } = req.query
    const contentType: string = req.params.contentType
    const queryParams = getStringifiedQueryParams({
      contentType,
      endDate,
      isCompleted,
      startDate,
    })

    const response = await axios.get(
      `${apiEndpoints.analytics}/api/userprogress?${queryParams}`,
      {
        headers: {
          Authorization: req.headers.authorization,
          verify_url: `${CONSTANTS.HTTPS_HOST}:${CONSTANTS.PORTAL_PORT}/protected/v8/user/details`,
        },
      }
    )

    res.send(response.data)
  }
)

dashboardApi.get('/course', async (req: Request, res: Response) => {
  try {

    const userId = extractUserIdFromRequest(req)
    const { contentType, status, pageState } = req.query
    const response = await axios.get(
      // tslint:disable-next-line:max-line-length
      `${apiEndpoints.progress_history}/${userId}/dashboard/courses?status=${status}&content_type=${contentType}&page_state${pageState}`,
      {
        headers: {
          Authorization: req.headers.authorization,
          rootOrg: req.header('rootOrg'),
        },
      }
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
dashboardApi.get('/userOrgTime', async (req: Request, res) => {
  try {
    const { startdate, enddate } = req.query

    const queryParams = getStringifiedQueryParams({
      enddate,
      startdate,
    })
    const userID = extractUserIdFromRequest(req)
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }

    const response = await axios.get(
      `${apiEndpoints.timeSpent}/${userID}/dashboard/timespent?${queryParams}`,
      {
        ...axiosRequestConfig,
        headers: { rootOrg },
      }
    )

    return res.send(response.data)
  } catch (err) {
    return res
      .status((err && err.response && err.response.status) || 500)
      .send(err)
  }
})
