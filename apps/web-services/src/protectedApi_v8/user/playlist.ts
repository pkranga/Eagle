/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { IContent } from '../../models/content.model'
import { IPaginatedApiResponse } from '../../models/paginatedApi.model'
import {
  EPlaylistTypes,
  IPlaylist,
  IPlaylistSbExtResponse,
  IPlaylistShareRequest,
  IPlaylistUpdateTitleRequest,
  IPlaylistUpsertRequest,
} from '../../models/playlist.model'
import {
  transformToPlaylistV2,
  transformToSbExtUpdateRequest,
  transformToSbExtUpsertRequest
} from '../../service/playlist'
import { processContent } from '../../utils/contentHelpers'
import { CONSTANTS } from '../../utils/env'
import { logError } from '../../utils/logger'
import { ERROR } from '../../utils/message'
import { extractUserIdFromRequest } from '../../utils/requestExtract'

const API_END_POINTS = {
  playlist: (userId: string, playlistId: string) =>
    `${CONSTANTS.SB_EXT_API_BASE}/v1/users/${userId}/playlist/${playlistId}`,
  playlistV2: (userId: string, playlistId: string) =>
    `${CONSTANTS.SB_EXT_API_BASE}/v2/users/${userId}/playlist/${playlistId}`,
  playlistV3: (userId: string, playlistId: string) =>
    `${CONSTANTS.SB_EXT_API_BASE_2}/v1/users/${userId}/playlists/${playlistId}`,
  playlists: (userId: string) => `${CONSTANTS.SB_EXT_API_BASE}/v1/users/${userId}/playlist`,
  playlistsV2: (userId: string) => `${CONSTANTS.SB_EXT_API_BASE}/v2/users/${userId}/playlist`,
}

async function sharePlaylist(userId: string, request: IPlaylistShareRequest, rootOrg: string) {
  return axios.post(
    API_END_POINTS.playlistsV2(userId),
    {
      request: {
        message: request.message,
        playlist_id: request.id,
        playlist_title: request.name,
        resource_ids: request.contentIds,
        shared_with: request.shareWith,
      },
    },
    { params: { type: 'share' }, ...axiosRequestConfig, headers: { rootOrg } }
  )
}

async function getPlaylistsAllTypes(userId: string, rootOrg: string) {
  try {
    const userPlaylistsPromise = axios.get(
      API_END_POINTS.playlistsV2(userId),
      { ...axiosRequestConfig, params: { type: EPlaylistTypes.ME }, headers: { rootOrg } }
    )
    const pendingPlaylistsPromise = axios.get(
      API_END_POINTS.playlistsV2(userId),
      { ...axiosRequestConfig, params: { type: EPlaylistTypes.PENDING }, headers: { rootOrg } }
    )

    const userPlaylists: IPlaylistSbExtResponse = (await userPlaylistsPromise).data
    const pendingPlaylists: IPlaylistSbExtResponse = (await pendingPlaylistsPromise).data
    return {
      data: {
        pending: pendingPlaylists.result.response.map(transformToPlaylistV2),
        share: userPlaylists.result.response.filter(
          (playlist) => Boolean(playlist.shared_by)).map(transformToPlaylistV2),
        user: userPlaylists.result.response.filter(
          (playlist) => !Boolean(playlist.shared_by)).map(transformToPlaylistV2),
      },
      error: undefined,
    }
  } catch (err) {
    return { data: undefined, error: err }
  }
}

export async function getPlaylist(userId: string, playlistId: string, rootOrg: string) {
  const response = await axios.get(
    API_END_POINTS.playlist(userId, playlistId),
    { ...axiosRequestConfig, headers: { rootOrg } }
  )
  return transformToPlaylistV2(response.data)
}

async function getPlaylists(userId: string, type: string, rootOrg: string): Promise<IPlaylist[]> {
  const response = await axios.get(
    API_END_POINTS.playlistsV2(userId),
    {
      ...axiosRequestConfig,
      headers: { rootOrg },
      params: { type },
    })
  const playlistSbExtResponse: IPlaylistSbExtResponse = response.data
  if (
    playlistSbExtResponse &&
    playlistSbExtResponse.result &&
    playlistSbExtResponse.result.response &&
    playlistSbExtResponse.result.response.length
  ) {
    return playlistSbExtResponse.result.response.map(transformToPlaylistV2)
  }

  return []
}

export const playlistApi = Router()

playlistApi.get('/recent', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.get(
      API_END_POINTS.playlistsV2(userId),
      {
        ...axiosRequestConfig,
        headers: { rootOrg },
        params: { type: 'recent' },
      })
    const result: IPaginatedApiResponse = {
      contents: ((response.data.result || {}).response || []).map((content: IContent) => processContent(content)),
      hasMore: false,
    }
    res.send(result)
  } catch (err) {
    logError('RECENT PLAYLIST CONTENTS FETCH ERROR >', err)
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

playlistApi.get('/accept/:playlistId', async (req, res) => {
  const playlistId = req.params.playlistId
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const playlists = await getPlaylists(userId, 'share', rootOrg)
    const playlist = playlists.find((p: IPlaylist) => p.id === playlistId)
    if (playlist) {
      const request = {
        request: {
          changed_resources: playlist.contents.map((content) => content.identifier),
          isShared: 0,
          playlist_title: playlist.name,
          resource_ids: playlist.contents.map((content) => content.identifier),
          shared_by: playlist.sharedBy,
          source_playlist_id: playlist.id,
          user_action: 'create',
        },
      }
      const response = await axios.post(
        `${API_END_POINTS.playlists(userId)}?type=copy`,
        request,
        { ...axiosRequestConfig, headers: { rootOrg } }
      )
      res.status(response.status).send(response.data)
      return
    }

    res.status(404).send()
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

playlistApi.get('/:type/:playlistId', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const { playlistId } = req.params
    const response = await axios({
      method: 'GET',
      url: API_END_POINTS.playlistV2(userId, playlistId),
      ...axiosRequestConfig,
      headers: {
        rootOrg,
      },
    })

    res.status(response.status).send(transformToPlaylistV2(response.data))
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

playlistApi.delete('/:playlistId', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const playlistId = req.params.playlistId
    const response = await axios.delete(
      API_END_POINTS.playlist(userId, playlistId), { ...axiosRequestConfig, headers: { rootOrg } })
    if (response.data.result.response === 'SUCCESS') {
      res.status(response.status).send(true)
    } else {
      res.status(500).send(false)
    }
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

playlistApi.get('/', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  const rootOrg = req.header('rootOrg')
  if (!rootOrg) {
    res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
    return
  }
  const allPlaylists = await getPlaylistsAllTypes(userId, rootOrg)

  if (allPlaylists.error) {
    const err = allPlaylists.error
    res.status(500)
      .send((err && err.response && err.response.data) || err)
    return
  }
  res.send(allPlaylists.data)
})

playlistApi.patch('/:playlistId', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  try {
    const request: IPlaylistUpdateTitleRequest = req.body
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const playlistId = req.params.playlistId
    const url = API_END_POINTS.playlistV3(userId, playlistId)
    const response = await axios({
      ...axiosRequestConfig,
      data: transformToSbExtUpdateRequest(request),
      headers: {
        rootOrg,
      },
      method: 'PATCH',
      url,
    })
    res.send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

playlistApi.post('/', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  try {
    const request: IPlaylistUpsertRequest = req.body
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }

    let url = API_END_POINTS.playlists(userId)
    if (req.query && req.query.type) {
      url += `?type=${req.query.type}`
    }

    const response = await axios.post(
      url,
      { request: transformToSbExtUpsertRequest(request) },
      { ...axiosRequestConfig, headers: { rootOrg } }
    )

    let shareResponse = { data: null }
    if (
      response.data &&
      response.data.result &&
      response.data.result.playlist_id &&
      request.shareWith &&
      request.shareWith.length
    ) {
      shareResponse = await sharePlaylist(userId, {
        contentIds: request.contentIds,
        id: response.data.result.playlist_id,
        message: request.shareMsg,
        name: request.title,
        shareWith: request.shareWith,
      }, rootOrg)
    }

    res.json({ create: response.data, share: shareResponse.data })
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

playlistApi.delete('/reject/:playlistId', async (req, res) => {
  const playlistId = req.params.playlistId
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const response = await axios.delete(
      `${API_END_POINTS.playlists(userId)}/${playlistId}`,
      {
        ...axiosRequestConfig,
        headers: { rootOrg },
        params: { type: 'share' },
      }
    )
    res.status(response.status).send()
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

playlistApi.get('/:type', async (req, res) => {
  const type = req.params.type
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const playlists = await getPlaylists(userId, type, rootOrg)
    res.send(playlists)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})

playlistApi.post('/share', async (req, res) => {
  const userId = extractUserIdFromRequest(req)
  try {
    const rootOrg = req.header('rootOrg')
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const request = {
      ...req.body,
      message: req.body.shareMsg,
    }
    const response = await sharePlaylist(userId, request, rootOrg)
    res.send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500)
      .send((err && err.response && err.response.data) || err)
  }
})
