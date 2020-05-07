/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'
import { logError } from '../utils/logger'
import { ERROR } from '../utils/message'

const apiEndpoints = {
  tnc: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/latest/terms`,
}

export const publicTnc = Router()

publicTnc.get('/', async (req, res) => {
  try {
    const rootOrg = req.header('rootOrg') || ''
    const org = req.header('org') || ''
    let locale = 'en'
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    if (req.query.locale) {
      locale = req.query.locale
    }
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        langCode: locale,
        org,
        rootOrg,
      },
      method: 'GET',
      url: apiEndpoints.tnc,
    })
    res.json(response.data)
  } catch (err) {
    logError('TNC ERR >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
