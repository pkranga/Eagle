/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import request from 'request'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { logInfoHeading } from '../../utils/logger'
import { ERROR } from '../../utils/message'
import {
  extractUserIdFromRequest,
  extractUserToken,
} from '../../utils/requestExtract'
import { getUserProfile } from './profile'
import { getUserRoles } from './roles'
import { getTncStatus } from './tnc'

export const detailsApi = Router()

const API_END_POINTS = {
  emailId: `${CONSTANTS.PID_API_BASE}/user/multi-fetch/email`,
  pidProfile: `${CONSTANTS.PID_API_BASE}/user/get-update`,
}

detailsApi.get('/', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const rootOrg = req.header('rootOrg') || ''
    const org = req.header('org') || ''
    const locale = req.header('langCode')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const tncStatus = await getTncStatus(userId, rootOrg, org, locale)
    const roles = await getUserRoles(userId, rootOrg)

    res.json(
      {
        group: [],
        roles,
        tncStatus,
      }
    )
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
    return
  }
})

detailsApi.get('/wtoken', async (req, res) => {
  try {
    const rootOrg = req.header('rootOrg') || ''
    const org = req.header('org') || ''
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const kcToken = extractUserToken(req)
    const url = API_END_POINTS.pidProfile
    // tslint:disable-next-line: no-commented-code
    // const body = {
    //   json: {
    //     token: kcToken,
    //   },
    // }
    const options: request.CoreOptions = {
      headers: {
        org,
        rootOrg,
      },
      ...axiosRequestConfig,
      json: {
        token: kcToken,
      },
    }
    // tslint:disable-next-line: no-commented-code
    // const bodyWithConfigRequestOptions = { ...body, options }
    logInfoHeading('==========WToken API Request===============')
    // tslint:disable-next-line: no-console
    console.log(options)
    request
      .post(url, options)
      .pipe(res)
  } catch (err) {
    // tslint:disable-next-line: no-console
    console.log('------------------W TOKEN ERROR---------\n', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

detailsApi.get('/infosys', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const userProfile = await getUserProfile(userId, req)
    res.json({
      userProfile,
    })
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

detailsApi.post('/detailV1', async (req, res) => {
  const _rootOrg = req.header('rootOrg')
  const url = `${API_END_POINTS.emailId}`
  try {
    if (_rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.post(
      url,
      {
        conditions: {
          rootOrg: _rootOrg,
        },
        source_fields: [
          'wid',
          'email',
          'first_name',
          'last_name',
        ],
        values: [
          req.body.email,
        ],

      },
      {
        ...axiosRequestConfig,
        headers: { _rootOrg },
      }
    )

    res.json(response.data)
  } catch (err) {
    res.status(500).send(err)
  }
})
