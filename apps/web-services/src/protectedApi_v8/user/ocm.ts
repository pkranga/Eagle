/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const API_END_POINTS = {
  user: CONSTANTS.SB_EXT_API_BASE + '/v1/users/',
}

export const ocmApi = Router()

ocmApi.get('/getToDos/:id', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const id = req.params.id
    const response = await axios.get(
      `${API_END_POINTS.user}${userId}/task_groups/${id}/tasks`,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
