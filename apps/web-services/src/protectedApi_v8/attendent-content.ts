/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'
import { ERROR } from '../utils/message'
import { extractUserIdFromRequest } from '../utils/requestExtract'

const API_END_POINTS = {
  attendedCourses: (userId: string, sourceFields?: string) =>
    `${CONSTANTS.SB_EXT_API_BASE_2}/v1/users/${userId}/attended-content?source_fields=${sourceFields}`,
  attendedUsers: (contentId: string) =>
    `${CONSTANTS.SB_EXT_API_BASE_2}/v1/content/${contentId}/attended-users`,
  verifyAttendedUsers: (userId: string, contentIds: string) =>
    `${CONSTANTS.SB_EXT_API_BASE_2}/v1/users/${userId}/verify-attendence?content_id=${contentIds}`,
}

export const attendedContentApi = Router()

attendedContentApi.get('/attendedCourses', async (req, res) => {
  const sourceFields = req.query.sourceFields || ''
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.get(API_END_POINTS.attendedCourses(userId, sourceFields), {
      ...axiosRequestConfig,
      headers: { rootOrg },
    })

    const finalResponse = {
      contents: response.data,
    }

    res.json(finalResponse)
  } catch (err) {
    res
      .status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

attendedContentApi.get('/attendedUsers/:contentId', async (req, res) => {
  const { contentId } = req.params
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.get(API_END_POINTS.attendedUsers(contentId), {
      ...axiosRequestConfig,
      headers: { rootOrg },
    })

    res.status(response.status).send(response.data)
  } catch (err) {
    res
      .status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

attendedContentApi.get('/verifyAttendedUsers', async (req, res) => {
  const contentIds = req.query.contentIds
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.get(API_END_POINTS.verifyAttendedUsers(userId, contentIds), {
      ...axiosRequestConfig,
      headers: { rootOrg },
    })

    res.status(response.status).send(response.data)
  } catch (err) {
    res
      .status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})
