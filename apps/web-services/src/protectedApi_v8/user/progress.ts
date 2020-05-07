/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { logError, logErrorHeading } from '../../utils/logger'
import { ERROR } from '../../utils/message'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const API_END_POINTS = {
  hash: (userId: string) => `${CONSTANTS.SB_EXT_API_BASE_2}/v3/users/${userId}/contentlist/progress`,
}

export const progressApi = Router()

progressApi.get('/', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        rootOrg,
      },
      method: 'GET',
      url: API_END_POINTS.hash(extractUserIdFromRequest(req)),
    })
    res.json(response.data)
  } catch (err) {
    logErrorHeading('PROGRESS HASH ERROR')
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
