/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { IPaginatedApiResponse } from '../../models/paginatedApi.model'
import { CONSTANTS } from '../../utils/env'
import { logError } from '../../utils/logger'
import { ERROR } from '../../utils/message'
import { extractUserIdFromRequest, IAuthorizedRequest } from '../../utils/requestExtract'
import { getMultipleContent } from '../content'

const API_END_POINTS = {
  contentLikeNumber: `${CONSTANTS.SB_EXT_API_BASE_2}/v1/likes-count`,
  like: (userId: string) => `${CONSTANTS.SB_EXT_API_BASE_2}/v1/user/${userId}/likes`,
}

export const userContentApi = Router()

userContentApi.post('/contentLikes', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }

    const response = await axios.post(API_END_POINTS.contentLikeNumber, req.body, {
      ...axiosRequestConfig,
      headers: { rootOrg },
    })
    res.status(response.status).send(response.data)
  } catch (err) {
    logError('ERROR FETCHING CONTENT LIKES >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

userContentApi.get('/like', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await fetchLikedIdsResponse(req, rootOrg, org)
    res.json(response)
  } catch (err) {
    logError('ERROR FETCHING LIKES >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
export async function fetchLikedIdsResponse(req: IAuthorizedRequest, rootOrg: string, org: string) {
  try {
    const response = await axios({
      ...axiosRequestConfig,
      headers: {
        org,
        rootOrg,
      },
      method: 'GET',
      url: `${API_END_POINTS.like(extractUserIdFromRequest(req))}`,
    })
    return response.data
  } catch (e) {
    throw new Error(e)
  }
}
userContentApi.get('/like/contents', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const likedIdsResponse = await fetchLikedIdsResponse(req, rootOrg, org)
    const likedIds = likedIdsResponse || []
    if (!Array.isArray(likedIds) || !likedIds.length) {
      res.send([])
    }
    const response = await getMultipleContent(likedIds, rootOrg, org, extractUserIdFromRequest(req))
    const result: IPaginatedApiResponse = {
      contents: response || [],
      hasMore: false,
    }
    res.json(result)
  } catch (err) {
    logError('ERROR in LIKE GET CONTENTS >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

userContentApi.post('/like/:contentId', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
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
      url: `${API_END_POINTS.like(extractUserIdFromRequest(req))}?content_id=${
        req.params.contentId
      }`,
    })
    res.json(response.data)
  } catch (err) {
    logError('ERROR LIKING >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
userContentApi.delete('/unlike/:contentId', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!rootOrg || !org) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios({
      ...axiosRequestConfig,
      data: req.body,
      headers: {
        rootOrg,
      },
      method: 'DELETE',
      url: `${API_END_POINTS.like(extractUserIdFromRequest(req))}?content_id=${
        req.params.contentId
      }`,
    })
    res.json(response.data)
  } catch (err) {
    logError('ERROR UN-LIKING >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
