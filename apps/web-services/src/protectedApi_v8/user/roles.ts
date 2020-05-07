/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { logError } from '../../utils/logger'
import { ERROR } from '../../utils/message'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const apiEndpoints = {
  role: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/user/roles`,
  updateRoles: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/update/roles`,
}

export async function getUserRoles(userId: string, rootOrg: string) {
  try {
    const response = await axios.get<{ result: { response: string[] } }>(
      `${apiEndpoints.role}?userid=${userId}`,
      { ...axiosRequestConfig, headers: { rootOrg } }
    )
    return response.data
  } catch (error) {
    return ['author']
  }
}

export const protectedRoles = Router()

protectedRoles.get('/', async (req, res) => {
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const userId = extractUserIdFromRequest(req)
    const response = await getUserRoles(userId, rootOrg)
    res.json(response)
  } catch (err) {
    logError('ERROR FETCHING ROLES OF USER ->', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

protectedRoles.get('/allRoles', async (req, res) => {
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const userId = 'masteruser'
    const response = await getUserRoles(userId, rootOrg)
    res.json(response)
  } catch (err) {
    logError('ERROR FETCHING ALL ROLES ->', err)
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.data) || err)
  }
})

protectedRoles.get('/:userId', async (req, res) => {
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const userId = req.params.userId
    const response = await getUserRoles(userId, rootOrg)
    res.json(response)
  } catch (err) {
    logError('ERROR FETCHING ROLES OF SPECIFIC USER ->', err)
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.data) || err)
  }
})

protectedRoles.patch('/', async (req, res) => {
  try {
    const rootOrg = req.header('rootOrg')
    const response = await axios({
      ...axiosRequestConfig,
      data: req.body,
      headers: {
        rootOrg,
      },
      method: 'PATCH',
      url: `${apiEndpoints.updateRoles}`,
    })
    res.json(response.data || {})
  } catch (err) {
    logError('ERROR ON UPDATE USER ROLES >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
