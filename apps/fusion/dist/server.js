/*               "Copyright 2020 Infosys Ltd.
http://http-url
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const path = require('path')
var express = require('express')
var expressStaticGzip = require('express-static-gzip')
const helmet = require('helmet')
const timeout = require('connect-timeout')
const morgan = require('morgan')
http://http-url

const CONSTANTS = {
  PORTAL_PORT: parseInt(process.env.PORTAL_PORT || '3002', 10),
http://http-url
http://http-url
}

var app = express()
http://http-url
  timeout: 10000,
})
app.use(timeout('100s'))
// Add required helmet configurations
app.use(
  helmet({
    frameguard: {
      action: 'sameorigin',
    },
    noCache: true,
    hidePoweredBy: true,
    ieNoOpen: true,
    dnsPrefetchControl: {
      allow: true,
    },
    noSniff: true,
    contentSecurityPolicy: {
      directives: {
        frameAncestors: [
          "'self'",
http://http-url
http://http-url
http://http-url
        ],
      },
    },
  })
)
app.use('/LA', proxyCreator(express.Router(), CONSTANTS.LA_HOST_PROXY))
app.use(morgan('combined'))
app.use(haltOnTimedOut)
app.use(
  '/ScormCoursePlayer',
http://http-url
);


serveAssets('')
serveAssets('/ar')
serveAssets('/de')
serveAssets('/es')
serveAssets('/fr')
serveAssets('/fr-ca')
serveAssets('/nl')
serveAssets('/zh-CN')
serveAssets('/ja')

function serveAssets(hostPath) {
  app.use(
    `${hostPath}/assets`,
    proxyCreator(express.Router(), CONSTANTS.WEB_HOST_PROXY + '/web-hosted/client-assets/dist')
  )
}

uiHostCreator('/ar', 'ar');
uiHostCreator('/de', 'de');
uiHostCreator('/es', 'es');
uiHostCreator('/fr', 'fr');
uiHostCreator('/fr-ca', 'fr-ca');
uiHostCreator('/nl', 'nl');
uiHostCreator('/zh-CN', 'zh-CN');
uiHostCreator('/ja', 'ja');
uiHostCreator('', 'en');
app.use(haltOnTimedOut);

const port = CONSTANTS.PORTAL_PORT
app.listen(port, '', err => {
  console.error(err || 'No Error', `Server started at ${port}`)
})

function proxyCreator(route, baseUrl) {
  route.all('/*', (req, res) => {
    proxy.web(req, res, {
      target: baseUrl,
    })
  })
  return route
}

function uiHostCreator(hostPath, hostFolderName) {
  app.use(
    `${hostPath}`,
    expressStaticGzip(path.join(__dirname, `www/${hostFolderName}`), {
      enableBrotli: true,
      orderPreference: ['br', 'gz'],
    })
  )
  app.get(`${hostPath}/*`, (req, res) => {
    if (req.url.startsWith('/assets/')) {
      res.status(404).send('requested asset is not available')
    } else {
      res.sendFile(path.join(__dirname, `www/${hostFolderName}/index.html`))
    }
  })
}


function haltOnTimedOut(req, _res, next) {
  if (!req.timedout) next()
}
