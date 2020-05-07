/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import express from 'express'
import { createProxyServer } from 'http-proxy'
import { axiosRequestConfig } from '../configs/request.config'
import { CONSTANTS } from '../utils/env'

const proxyCreator = createProxyServer()
const contentStoreApi = '/contentv3/download/'
export const authContent = express.Router()

authContent.all('*', async (req, res) => {
  if (req.method === 'GET') {
    req.url = decodeURIComponent(req.url)

    const position = Math.max(req.url.indexOf('https:/'), req.url.indexOf('http:/'))
    if (position > -1) {
      req.url = req.url.slice(position)
    } else {
      req.url = `http://private-content-service${req.url.slice(req.url.indexOf('/content-store/'))}`
    }
    if (req.url.indexOf('http://') < 0 && req.url.indexOf('https://') < 0) {
      req.url = req.url.replace(':/', '://')
    }
    if (req.url.indexOf('/content-store/') > -1) {
      req.url =
        contentStoreApi +
        req.url
          .split('/')
          .slice(4)
          .join('%2F')
      if (req.url.indexOf('.html') > -1) {
        try {
          const response = await axios.get(CONSTANTS.CONTENT_API_BASE + req.url, axiosRequestConfig)
          res.set('Content-Type', 'text/html')
          res.send(response.data)
        } catch (err) {
          res.status((err && err.response && err.response.status) || 500).send(err)
        }
      } else {
        proxyCreator.web(req, res, {
          target: CONSTANTS.CONTENT_API_BASE,
        })
      }
    } else if (req.url.indexOf('/content/') > -1) {
      req.url = req.url
        .split('/')
        .slice(3)
        .join('/')
      proxyCreator.web(req, res, {
        target: CONSTANTS.CONTENT_API_BASE,
      })
    } else if (req.url.indexOf(contentStoreApi) > -1) {
      req.url =
        contentStoreApi +
        req.url
          .split('/')
          .slice(5)
          .join('%2F')
      proxyCreator.web(req, res, {
        target: CONSTANTS.CONTENT_API_BASE,
      })
    } else {
      axios({
        method: 'GET',
        responseType: 'stream',
        url: req.url,
      })
        .then((response) => {
          response.data.pipe(res)
        })
        .catch((error) => {
          res.status(500).send(error)
        })
    }
  } else if (req.method === 'POST') {
    if (req.url.indexOf('video-transcoding') < 0) {
      if (req.url.indexOf('publish') > 0) {
        req.url = '/contentv3/publish/' + req.url.replace('/publish/', '').replace(/\//g, '%2F')
      } else {
        req.url = '/contentv3/upload/' + req.url.replace('/upload/', '').replace(/\//g, '%2F')
      }
    }
    proxyCreator.web(req, res, {
      target: CONSTANTS.CONTENT_API_BASE,
    })
  }

  proxyCreator.on('error', (err) => {
    if (err) {
      res.writeHead(500)
      res.end(err)
    }
  })

  proxyCreator.on('unhandledRejection', () => {
    res.writeHead(500)
    res.end('Some error occured')
  })
})
