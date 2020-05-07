/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import express from 'express'
import { createProxyServer } from 'http-proxy'
import { CONSTANTS } from '../utils/env'

export const authSearch = express.Router()
const proxyCreator = createProxyServer()

authSearch.all('*', (req, res) => {
    req.url = req.url.replace('/authSearchApi', '')
    proxyCreator.web(req, res, {
        target: CONSTANTS.SB_EXT_API_BASE,
    })
})
