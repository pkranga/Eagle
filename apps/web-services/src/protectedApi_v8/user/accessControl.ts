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
  contents: `${CONSTANTS.SB_EXT_API_BASE}/accesscontrol/user`,
}

/**
 *
 * @param contentIds : comma separated ids
 * @param userId : string
 */
export async function checkContentAccess(
  contentIds: string,
  userId: string
): Promise<{ [id: string]: { hasAccess: boolean } }> {
  try {
    const response = await axios.get(
      `${API_ENDPOINTS.contents}/${userId}/content?contentIds=${contentIds}`,
      axiosRequestConfig
    )
    return response.data.result.response || {}
  } catch (e) {
    logError('ERROR ON ACCESS CHECK >', e)
    return {}
  }
}

export const accessControlApi = Router()

accessControlApi.post('/', async (req, res) => {
  try {
    const contentIds = req.body.contentIds
    const uuid = extractUserIdFromRequest(req)
    const response = await checkContentAccess(contentIds.join(','), uuid)
    res.json(response)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
