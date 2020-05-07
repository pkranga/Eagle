/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { extractUserIdFromRequest } from '../../utils/requestExtract'
const API_END_POINTS = {
  viewprofile: `${CONSTANTS.NODE_API_BASE}/userprofiles/pathfinders/viewprofile`,
}
export const userMiniProfile = Router()

userMiniProfile.get('/:userId', async (req, res) => {
  const userId = req.params.userId
  const wid = extractUserIdFromRequest(req)
  const rootOrg = req.header('rootOrg')
  const org = req.header('org')
  const url = API_END_POINTS.viewprofile
  try {
    const response = await axios.get(url, {
      ...axiosRequestConfig,
      headers: { 'Content-Type': 'application/json', 'user_id': userId, wid, rootOrg, org },
    })
    const data = response.data
    res.send(data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
