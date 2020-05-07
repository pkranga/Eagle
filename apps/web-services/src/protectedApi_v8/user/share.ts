/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { ERROR } from '../../utils/message'

const API_END_POINTS = {
  SHARE: CONSTANTS.SB_EXT_API_BASE + '/v1/Notification/Send',
  SHARE_CONTENT: CONSTANTS.NOTIFICATIONS_API_BASE + '/v1/notification/event',
}

export const shareApi = Router()

shareApi.post('/', async (req, res) => {
  try {
    const response = await axios.post(
      API_END_POINTS.SHARE,
      req.body,
      axiosRequestConfig
    )
    res.status(response.status).json(response.data.result)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

shareApi.post('/content', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    const langCode = req.header('locale')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios({
      ...axiosRequestConfig,
      data: req.body,
      headers: {
        langCode,
        org,
        rootOrg,
      },
      method: 'POST',
      url: API_END_POINTS.SHARE_CONTENT,
    })
    res.status(response.status).json(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})
