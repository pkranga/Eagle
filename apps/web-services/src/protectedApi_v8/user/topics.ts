/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Request, Response, Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { getStringifiedQueryParams } from '../../utils/helpers'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const apiEndPoints = {
  add: `${CONSTANTS.SB_EXT_API_BASE}/v1/user/topic/add`,
  autocomplete: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/interests/auto`,
  interestV2: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/users`,
  read: `${CONSTANTS.SB_EXT_API_BASE}/v1/user/topic/read`,
}

export const topicsApi = Router()
topicsApi.get('/', async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const response = await axios.get(
      `${apiEndPoints.read}/${userId}`,
      axiosRequestConfig
    )

    if (
      response.data &&
      response.data.result &&
      response.data.result.response &&
      response.data.result.response.topics
    ) {
      res.send(response.data.result.response.topics)
      return
    }

    res.status(500).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

topicsApi.post('/', async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const body = {
      request: {
        ...req.body,
        userId,
      },
    }
    const response = await axios.post(
      apiEndPoints.add,
      body,
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

topicsApi.get('/v2', async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const rootOrg = req.header('rootOrg')
    const response = await axios.get(
      `${apiEndPoints.interestV2}/${userId}/interests`,
      {
        ...axiosRequestConfig,
        headers: { rootOrg },
      }
    )
    if (response.data && Array.isArray(response.data.user_interest)) {
      res.send(response.data.user_interest)
      return
    }
    res.status(200).send([])
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

topicsApi.delete('/', async (req: Request, res: Response) => {
  try {
    const { interest } = req.query
    const rootOrg = req.header('rootOrg')

    const userId = extractUserIdFromRequest(req)
    const queryParams = getStringifiedQueryParams({
      interest,
    })

    const response = await axios.delete(
      `${apiEndPoints.interestV2}/${userId}/interests?${queryParams}`,
      {
        ...axiosRequestConfig,
        headers: { rootOrg },
      }
    )
    res.json(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

topicsApi.patch('/', async (req: Request, res: Response) => {
  try {
    const { interest } = req.query
    const rootOrg = req.header('rootOrg')
    const userId = extractUserIdFromRequest(req)
    const queryParams = getStringifiedQueryParams({
      interest,
    })

    const response = await axios.patch(
      `${apiEndPoints.interestV2}/${userId}/interests?${queryParams}`,
      {},
      {
        ...axiosRequestConfig,
        headers: { rootOrg },
      }
    )
    res.json(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

topicsApi.get('/suggested', async (req: Request, res: Response) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const rootOrg = req.header('rootOrg')
    const org = req.header('org')
    const langCode = req.header('locale')
    const response = await axios.get(
      `${apiEndPoints.interestV2}/${userId}/interests/suggested`,
      {
        ...axiosRequestConfig,
        headers: { rootOrg, org, langCode },
      }
    )

    res.send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

topicsApi.get('/autocomplete', async (req: Request, res: Response) => {
  try {
    const { query } = req.query
    const rootOrg = req.header('rootOrg')
    const org = req.header('org')
    const langCode = req.header('locale')
    // tslint:disable-next-line: no-console
    console.log(
      // tslint:disable-next-line: max-line-length
      `AUTOCOMPLETE::${apiEndPoints.autocomplete}?query=${query}    :: rootOrg:${rootOrg}, org:${org}, langCode:${langCode}`
    )
    const response = await axios.get(
      `${apiEndPoints.autocomplete}?query=${query}`,
      {
        ...axiosRequestConfig,
        headers: { rootOrg, org, langCode },
      }
    )
    res.send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
