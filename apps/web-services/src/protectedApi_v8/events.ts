/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'

import { CONSTANTS } from '../utils/env'

const EVENTS_BASE_API = `${CONSTANTS.CONTENT_API_BASE}/live-events`

export const eventsApi = Router()

eventsApi.get('/', async (_req, res) => {
      try {
    const response = await axios.get(EVENTS_BASE_API, {
      ...axiosRequestConfig,
    })
    res.send((response.data))
  } catch (err) {
    return err
  }
})
