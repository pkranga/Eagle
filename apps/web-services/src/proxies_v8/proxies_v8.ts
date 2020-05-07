/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import express from 'express'
import { CONSTANTS } from '../utils/env'
import { ilpProxyCreatorRoute, proxyCreatorRoute, scormProxyCreatorRoute } from '../utils/proxyCreator'

export const proxiesV8 = express.Router()

proxiesV8.get('/', (_req, res) => {
  res.json({
    type: 'PROXIES Route',
  })
})

proxiesV8.use(
  '/content',
  proxyCreatorRoute(express.Router(), CONSTANTS.CONTENT_API_BASE + '/content')
)
proxiesV8.use(
  '/fastrack',
  proxyCreatorRoute(express.Router(), CONSTANTS.ILP_FP_PROXY + '/fastrack')
)
proxiesV8.use(
  '/hosted',
  proxyCreatorRoute(express.Router(), CONSTANTS.CONTENT_API_BASE + '/hosted')
)
proxiesV8.use(
  '/ilp-api',
  ilpProxyCreatorRoute(express.Router(), CONSTANTS.ILP_FP_PROXY)
)
proxiesV8.use(
  '/scorm-player',
  scormProxyCreatorRoute(express.Router(), CONSTANTS.SCORM_PLAYER_BASE)
)
proxiesV8.use(
  '/LA',
  proxyCreatorRoute(express.Router(), CONSTANTS.APP_ANALYTICS, 30000)
)
proxiesV8.use(
  '/static-ilp',
  proxyCreatorRoute(
    express.Router(),
    CONSTANTS.STATIC_ILP_PROXY + '/static-ilp'
  )
)
proxiesV8.use(
  '/web-hosted',
  proxyCreatorRoute(express.Router(), CONSTANTS.WEB_HOST_PROXY + '/web-hosted')
)
