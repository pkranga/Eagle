/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import express from 'express'
import { createProxyServer } from 'http-proxy'
import { CONSTANTS } from '../utils/env'

export const authBackend = express.Router()
const proxyCreator = createProxyServer()

authBackend.all('*', (req, res) => {
  req.url = req.url.replace('/authApi', '')
  proxyCreator.web(req, res, {
    target: CONSTANTS.AUTHORING_BACKEND,
  })
})
