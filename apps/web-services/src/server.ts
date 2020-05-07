/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import compression from 'compression'
import connectTimeout from 'connect-timeout'
import express, { NextFunction } from 'express'
import fileUpload from 'express-fileupload'
import expressSession from 'express-session'
import helmet from 'helmet'
import keycloakConnect from 'keycloak-connect'
import morgan from 'morgan'
import { authApi } from './authoring/content'

import { authContent } from './authoring/authContent'
import { authSearch } from './authoring/authSearch'
import { getKeycloakConfig } from './configs/keycloak.config'
import { getSessionConfig } from './configs/session.config'
import { protectedApiV8 } from './protectedApi_v8/protectedApiV8'
import { proxiesV8 } from './proxies_v8/proxies_v8'
import { publicApiV8 } from './publicApi_v8/publicApiV8'
import { CONSTANTS } from './utils/env'
import { logInfo, logSuccess } from './utils/logger'

function haltOnTimedOut(req: Express.Request, _: Express.Response, next: NextFunction) {
  if (!req.timedout) {
    next()
  }
}
export class Server {
  static bootstrap() {
    const server = new Server()
    server.app.listen(CONSTANTS.PORTAL_PORT, '0.0.0.0', () => {
      logSuccess(`${process.pid} : Server started at ${CONSTANTS.PORTAL_PORT}`)
    })
  }

  protected app = express()
  private keycloak?: keycloakConnect
  private constructor() {
    this.setKeyCloak()
    this.authoringProxies()
    this.configureMiddleware()
    this.servePublicApi()
    this.serverProtectedApi()
    this.serverProxies()
    this.authoringApi()
    this.resetCookies()
    this.app.use(haltOnTimedOut)
  }

  private configureMiddleware() {
    this.app.use(connectTimeout('240s'))
    this.app.use(compression())
    this.app.use(express.urlencoded({ extended: false, limit: '50mb' }))
    this.app.use(express.json({ limit: '50mb' }))
    this.app.use(fileUpload())
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            frameAncestors: [`'self'`],
          },
        },
        dnsPrefetchControl: { allow: true },
        frameguard: { action: 'sameorigin' },
        hidePoweredBy: true,
        ieNoOpen: true,
        noCache: false,
        noSniff: true,
      })
    )
    // TODO: See what needs to be logged
    this.app.use((req, _, next) => {
      logInfo(`Worker ${process.pid} : ${req.url}`)
      next()
    })
    this.app.use(morgan('dev'))
    this.app.use(
      morgan((tokens: morgan.TokenIndexer, req, res) =>
        [
          process.pid,
          tokens.method(req, res),
          tokens.url(req, res),
          tokens.status(req, res),
          tokens.res(req, res, 'content-length'),
          '-',
          tokens['response-time'](req, res),
          'ms',
          `timeout: ${CONSTANTS.TIMEOUT}`,
        ].join(' ')
      )
    )
    this.app.use(haltOnTimedOut)
  }
  private setKeyCloak() {
    const sessionConfig = getSessionConfig()
    this.keycloak = new keycloakConnect({ store: sessionConfig.store }, getKeycloakConfig())
    this.app.use(expressSession(sessionConfig))
    this.app.use(
      this.keycloak.middleware({
        admin: '/callback',
        logout: '/logout',
      })
    )
    this.keycloak.authenticated = (_request: express.Request) => {
      logInfo(`${process.pid}: User authenticated`)
    }
    this.keycloak.deauthenticated = (_request: express.Request) => {
      logInfo(`${process.pid}: User Deauthenticated`)
    }
  }
  private servePublicApi() {
    this.app.use('/public/v8', publicApiV8)
  }
  private serverProtectedApi() {
    if (this.keycloak) {
      this.app.use('/protected/v8', this.keycloak.protect(), protectedApiV8)
    }
  }
  private serverProxies() {
    if (this.keycloak) {
      this.app.use('/proxies/v8', this.keycloak.protect(), proxiesV8)
    }
  }
  private authoringProxies() {
    if (this.keycloak) {
      this.app.use('/authContent', this.keycloak.protect(), authContent)
      this.app.use('/authSearchApi', this.keycloak.protect(), authSearch)
    }
  }
  private authoringApi() {
    if (this.keycloak) {
      this.app.use('/authApi', authApi)
    }
  }
  private resetCookies() {
    this.app.use('/reset', (_req, res) => {
      logInfo('==========================\nCLEARING RES COOKIES')
      res.clearCookie('connect.sid')
      res.status(200).send()
    })
  }
}
