/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { logError } from '../../utils/logger'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const API_ENDPOINTS = {
  submission: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/users`,

}

export const classDiagramApi = Router()

classDiagramApi.post('/classdiagram/submit/:contentId', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const contentId = req.params.contentId
    const config = axiosRequestConfig
    config.headers = {
      rootOrg: req.header('rootOrg'),
    }

    const response = await axios.post(
      `${API_ENDPOINTS.submission}/${uuid}/exercises/${contentId}/classdiagram-submission`,
      {
        ...req.body,
      },
      config
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
