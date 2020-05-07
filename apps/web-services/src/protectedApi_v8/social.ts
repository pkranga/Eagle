/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'
import { logError } from '../utils/logger'
import { ERROR } from '../utils/message'
import { extractUserIdFromRequest } from '../utils/requestExtract'

const API_END_POINTS = {
  acceptAnswer: `${CONSTANTS.NODE_API_BASE}/useractivity/acceptAnswer`,
  activityUpdate: `${CONSTANTS.NODE_API_BASE}/useractivity/create`,
  activityUsers: `${CONSTANTS.NODE_API_BASE}/post/users`,
  authoringCatalog: `${CONSTANTS.NODE_API_BASE}/catalog/fetch`,
  autocomplete: `${CONSTANTS.NODE_API_BASE}/post/autocomplete`,
  deletePost: `${CONSTANTS.NODE_API_BASE}/authtool/deletepost`,
  draftPost: `${CONSTANTS.NODE_API_BASE}/authtool/draftpost`,
  editMeta: `${CONSTANTS.NODE_API_BASE}/authtool/editmeta`,
  editTags: `${CONSTANTS.NODE_API_BASE}/authtool/edittags`,
  publishPost: `${CONSTANTS.NODE_API_BASE}/authtool/publishpost`,
  searchSocial: `${CONSTANTS.NODE_API_BASE}/search/searchv1`,
  timeline: `${CONSTANTS.NODE_API_BASE}/post/timeline`,
  timelineV2: `${CONSTANTS.NODE_API_BASE}/post/timelinev2`,
  viewConversation: `${CONSTANTS.NODE_API_BASE}/post/viewConversation`,
}

export const socialApi = Router()

const INVALID_ORG_MSG = ERROR.ERROR_NO_ORG_DATA

socialApi.post('/post/publish', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.publishPost,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/draft', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.draftPost,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.put('/edit/tags', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.put(
      API_END_POINTS.editTags,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
socialApi.put('/edit/meta', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.put(
      API_END_POINTS.editMeta,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    logError('EDIT META ERROR >', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/delete', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios({
      ...axiosRequestConfig,
      data,
      method: 'DELETE',
      url: API_END_POINTS.deletePost,
    })
    res.status(response.status).send(response.data)
  } catch (err) {
    logError('ERROR DELETING POST', err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/autocomplete', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.autocomplete,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/viewConversation', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.viewConversation,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/timeline', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.timeline,
      data,
      { ...axiosRequestConfig, timeout: 20000 }
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/timelineV2', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.timelineV2,
      data,
      { ...axiosRequestConfig, timeout: 20000 }
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/activity/create', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.activityUpdate,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/acceptAnswer', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.acceptAnswer,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/activity/users', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.activityUsers,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/post/search', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
    }
    const response = await axios.post(
      API_END_POINTS.searchSocial,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

socialApi.post('/catalog', async (req, res) => {
  try {
    const org = req.header('org')
    const rootOrg = req.header('rootOrg')
    const userId = extractUserIdFromRequest(req)

    if (!org || !rootOrg) {
      res.status(400).send(INVALID_ORG_MSG)
      return
    }
    const data = {
      ...req.body,
      org,
      rootOrg,
      userid: userId,
    }
    const response = await axios.post(
      API_END_POINTS.authoringCatalog,
      data,
      axiosRequestConfig
    )
    res.status(response.status).send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
