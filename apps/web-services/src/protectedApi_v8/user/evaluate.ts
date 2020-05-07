/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import {
  extractUserIdFromRequest,
} from '../../utils/requestExtract'
const API_END_POINTS = {
  assessmentSubmitV2: `${CONSTANTS.SB_EXT_API_BASE_2}/v2/user`,
}
import { ERROR } from '../../utils/message'
export const evaluateApi = Router()

evaluateApi.post('/assessment/submit/v2', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const userId = extractUserIdFromRequest(req)
    const url = `${API_END_POINTS.assessmentSubmitV2}/${userId}/assessment/submit`
    const requestBody = {
      ...req.body,
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
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
