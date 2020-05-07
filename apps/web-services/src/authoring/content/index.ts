/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Request, Response, Router } from 'express'
import { AxiosRequestConfig } from '../../models/axios-request-config.model'
import { IContent } from '../../models/content.model'
import { ERROR } from '../constants/error'
import { CONSTANTS } from './../../utils/env'
import { getHierarchy } from './hierarchy'
import { getHierarchyWithContent } from './hierarchy-and-content'
import { searchForOtherLanguage } from './language-search'

export const authApi = Router()

authApi.get('/hierarchy/:id', async (req: Request, res: Response) => {
  try {
    const data = await getHierarchy(req.params.id, req)
    res.status(200).send(data)
  } catch (ex) {
    res.status(400).send({
      error: ex,
      msg: ERROR.GENERAL,
    })
  }
})

authApi.get('/hierarchy/content/:id', async (req: Request, res: Response) => {
  try {
    const data = await getHierarchyWithContent(req.params.id, req)
    res.status(200).send(data)
  } catch (ex) {
    res.status(400).send({
      error: ex,
      msg: ERROR.GENERAL,
    })
  }
})

authApi.get('/hierarchy/content/translation/:id', async (req: Request, res: Response) => {
  try {
    // tslint:disable-next-line: no-any
    const endResult: Array<{ content: IContent; data: any }> = []
    const otherLangContent = await searchForOtherLanguage(
      req.params.id,
      (req.headers.wid as string) || '392ad0a9-2d5f-47db-8134-b91bd2eb01d9',
      (req.headers.rootorg as string) || 'Siemens'
    )
    const resultPromise = otherLangContent.map(async (id) => getHierarchyWithContent(id, req))
    for (const result of resultPromise) {
      const data = await result
      endResult.push({
        ...data,
      })
    }
    res.status(200).send(endResult)
  } catch (ex) {
    res.status(400).send({
      error: ex,
      msg: ERROR.GENERAL,
    })
  }
})

authApi.post('/copy', (req: Request, res: Response) => {
  axios({
    data: {},
    method: 'POST',
    url: `${CONSTANTS.CONTENT_API_BASE}/contentv3/copy/${req.body.location}/${req.body.destination}`,
  } as AxiosRequestConfig)
    .then((response) => {
      res.status(response.status).send(response.data)
    })
    .catch((error) => {
      res.status(error.response.status).send(error.response.data)
    })
})

authApi.post('/encode', (req: Request, res: Response) => {
  const body: { text: string; location: string; fileName: string } = req.body
  const location = body.location.split('/').join('%2F')
  delete body.location
  axios({
    data: body,
    method: 'POST',
    url: `${CONSTANTS.CONTENT_API_BASE}/contentv3/transform-and-upload/base64/${location}`,
  } as AxiosRequestConfig)
    .then((response) => {
      res.status(response.status).send(response.data)
    })
    .catch((error) => {
      res.status(error.response.status).send(error.response.data)
    })
})

authApi.all('*', (req: Request, res: Response) => {
  try {
    let data = null
    if (req.body && req.body.data) {
      const sBinaryString = Buffer.from(req.body.data, 'base64').toString('binary')
      const aBinaryView = new Uint8Array(sBinaryString.length)
      Array.prototype.forEach.call(
        aBinaryView,
        (_el, idx, arr) => (arr[idx] = sBinaryString.charCodeAt(idx))
      )
      data = JSON.parse(
        new Uint16Array(aBinaryView.buffer).reduce(
          (str, byte) => str + String.fromCharCode(byte),
          ''
        )
      )
    }
    axios({
      data,
      method: req.method,
      url: CONSTANTS.AUTHORING_BACKEND + req.url,
    } as AxiosRequestConfig)
      .then((response) => {
        res.status(response.status).send(response.data)
      })
      .catch((error) => {
        res.status(error.response.status).send(error.response.data)
      })
  } catch (ex) {
    res.status(500).send({
      error: ex,
      msg: ERROR.GENERAL,
    })
  }
})
