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
  cohorts: `${CONSTANTS.SB_EXT_API_BASE_2}/v2/resources`,
  groupCohorts: (groupId: number) =>
    `${CONSTANTS.PID_API_BASE}/groups/${groupId}/users `,
}
const VALID_COHORT_TYPES = new Set(['activeusers', 'commongoals', 'authors', 'educators', 'top-performers'])

export const cohortsApi = Router()

cohortsApi.get('/:cohortType/:contentId', async (req, res) => {
  try {
    const cohortType = req.params.cohortType
    const contentId = req.params.contentId
    if (!VALID_COHORT_TYPES.has(cohortType)) {
      res.status(400).send('INVALID_COHORT_TYPE')
      return
    }
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const url = `${API_END_POINTS.cohorts}/${contentId}/user/${extractUserIdFromRequest(req)}/cohorts/${cohortType}`
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        rootOrg,
      },
      method: 'GET',
      url,
    })
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

cohortsApi.get('/:groupId', async (req, res) => {
  const { groupId } = req.params
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.get(API_END_POINTS.groupCohorts(groupId))
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
