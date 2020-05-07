/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { ERROR } from '../../utils/message'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const API_END_POINTS = {
  contentRating: (contentId: string, userId: string) =>
    `${CONSTANTS.SB_EXT_API_BASE_2}/v1/contents/${contentId}/users/${userId}/ratings`,
}

export const ratingApi = Router()

ratingApi.get('/:contentId', async (req, res) => {
  try {
    const contentId = req.params.contentId
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        rootOrg,
      },
      method: 'GET',
      url: `${API_END_POINTS.contentRating(contentId, extractUserIdFromRequest(req))}`,
    })
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

ratingApi.post('/:contentId', async (req, res) => {
  try {
    const contentId = req.params.contentId
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios({
      ...axiosRequestConfig,
      data: req.body,
      headers: {
        rootOrg,
      },
      method: 'POST',
      url: `${API_END_POINTS.contentRating(contentId, extractUserIdFromRequest(req))}`,
    })
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

ratingApi.delete('/:id', async (req, res) => {
  try {
    const contentId = req.params.id
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.delete(
      `${API_END_POINTS.contentRating(contentId, extractUserIdFromRequest(req))}`,
      {
        ...axiosRequestConfig,
        headers: {
          rootOrg,
        },
      }
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
