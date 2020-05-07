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
  conceptData: `${CONSTANTS.VIEWER_PLUGIN_RDBMS_API_BASE}/v1/db/conceptdata/resources`,
  execute: `${CONSTANTS.VIEWER_PLUGIN_RDBMS_API_BASE}/v1/users`,
}

export const rdbmsApi = Router()

rdbmsApi.get('/initializeDb/:contentId', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const contentId = req.params.contentId
    const response = await axios.get(
      `${API_ENDPOINTS.execute}/${uuid}/resources/${contentId}/initialize`,
      axiosRequestConfig
    )
    res.send(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.get('/conceptData/:contentId', async (req, res) => {
  try {
    const contentId = req.params.contentId
    const response = await axios.get(
      `${API_ENDPOINTS.conceptData}/${contentId}`,
      axiosRequestConfig
    )
    res.json(response)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.get('/expectedOutput/:contentId', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const contentId = req.params.contentId
    const response = await axios.get(
      `${API_ENDPOINTS.execute}/${uuid}/resources/${contentId}`,
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.get('/dbstructure/:contentId', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const contentId = req.params.contentId
    const response = await axios.get(
      `${API_ENDPOINTS.execute}/${uuid}/resources/${contentId}/tabledata`,
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.get('/tableRefresh/:contentId', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const contentId = req.params.contentId
    const response = await axios.get(
      `${API_ENDPOINTS.execute}/${uuid}/resources/${contentId}/tableinfo`,
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.post('/executeQuery', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const response = await axios.post(
      `${API_ENDPOINTS.execute}/${uuid}/query/execute`,
      {
        ...req.body,
      },
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.post('/compareQuery', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const response = await axios.post(
      `${API_ENDPOINTS.execute}/${uuid}/querycompareexecute`,
      {
        ...req.body,
      },
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.post('/playground', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const response = await axios.post(
      `${API_ENDPOINTS.execute}/${uuid}/query/playground`,
      {
        ...req.body,
      },
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.post('/compositeQuery/:type', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const type = req.params.type
    const response = await axios.post(
      `${API_ENDPOINTS.execute}/${uuid}/query/composite?type=${type}`,
      {
        ...req.body,
      },
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.post('/verifyExercise/:contentId', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const contentId = req.params.contentId
    const response = await axios.post(
      `${API_ENDPOINTS.execute}/${uuid}/resources/${contentId}?type=verify`,
      {
        ...req.body,
      },
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

rdbmsApi.post('/submitExercise/:contentId', async (req, res) => {
  try {
    const uuid = extractUserIdFromRequest(req)
    const contentId = req.params.contentId
    const response = await axios.post(
      `${API_ENDPOINTS.execute}/${uuid}/resources/${contentId}?type=submit`,
      {
        ...req.body,
      },
      axiosRequestConfig
    )
    res.json(response.data)
  } catch (err) {
    logError(err)
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
