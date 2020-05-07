/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
const path = require("path");
const express = require("express");
const session = require("express-session");
const compression = require("compression");
const helmet = require("helmet");
const timeout = require("connect-timeout");
const morgan = require("morgan");
const keycloakConnect = require("keycloak-connect");
const cassandraStore = require("cassandra-store");
const cassandraDriver = require("cassandra-driver");
const httpProxy = require("http-proxy");
const request = require("request");
const bodyParser = require("body-parser");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const CONSTANTS = {
  // PORTAL CONFIGS
  HTTPS_HOST: process.env.HTTPS_HOST || "https://IP-ADDR",
  APP_LOGS: process.env.APP_LOGS || "/logs",
  APP_CONFIGURATIONS: process.env.APP_CONFIGURATIONS || "/app-config",
  PORTAL_PORT: parseInt(process.env.PORTAL_PORT || "3002", 10),
  TIMEOUT: parseInt(process.env.TIMEOUT || "10000", 10),
  // DB | Stores
  CASSANDRA_IP: process.env.CASSANDRA_IP || "IP-ADDR",
  CASSANDRA_USERNAME: process.env.CASSANDRA_USERNAME || "",
  CASSANDRA_PASSWORD: process.env.CASSANDRA_PASSWORD || "",
  CASSANDRA_AUTH_ENABLED: process.env.CASSANDRA_AUTH_ENABLED,
  // APIs | Hostings
  CONTENT_API_BASE: process.env.CONTENT_API_BASE || "http://IP-ADDR:5903",
  WEB_HOST_PROXY: process.env.WEB_HOST_PROXY || "http://IP-ADDR:3007",
  STATIC_ILP_PROXY: process.env.STATIC_ILP_PROXY || "http://IP-ADDR:3005",
  // External Applications
  LA_HOST_PROXY: process.env.LA_HOST_PROXY || "http://IP-ADDR",
  ILP_FP_PROXY: process.env.ILP_FP_PROXY || "http://IP-ADDR",
  KEYCLOAK_REALM: process.env.KEYCLOAK_REALM || "sunbird"
};

console.log("---------------------\nCONSTANTS-------------------\n");
for (const key in CONSTANTS) {
  console.log(key, "--->", CONSTANTS[key]);
}

const cassandraAuthProvider = new cassandraDriver.auth.PlainTextAuthProvider(
  CONSTANTS.CASSANDRA_USERNAME,
  CONSTANTS.CASSANDRA_PASSWORD
);

const clientOptions = {
  contactPoints: [CONSTANTS.CASSANDRA_IP],
  keyspace: "portal",
  queryOptions: {
    prepare: true
  }
};
if (CONSTANTS.CASSANDRA_AUTH_ENABLED) {
  clientOptions["authProvider"] = cassandraAuthProvider;
}
const sessionConfig = {
  secret: "927yen45-i8j6-78uj-y8j6g9rf56hu",
  resave: false,
  saveUninitialized: false,
  store: new cassandraStore({
    table: "sessions",
    client: null,
    clientOptions: clientOptions
  })
};
const keycloak = new keycloakConnect(
  {
    store: sessionConfig.store
  },
  {
    serverUrl: `${CONSTANTS.HTTPS_HOST}/auth`,
    bearerOnly: true,
    realm: CONSTANTS.KEYCLOAK_REALM,
    resource: "portal",
    "ssl-required": "none"
  }
);
keycloak.authenticated = request => {
  console.log("user authenticated", request.kauth);
};
keycloak.deauthenticated = request => {
  console.log("user logged out", request.kauth);
};

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

const app = express();
app.use(timeout("100s"));
app.use(compression());
app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: "50mb"
  })
);
app.use(
  bodyParser.json({
    limit: "50mb"
  })
);
app.use(
  helmet({
    frameguard: {
      action: "sameorigin"
    },
    noCache: true,
    hidePoweredBy: true,
    ieNoOpen: true,
    dnsPrefetchControl: {
      allow: true
    },
    noSniff: true,
    contentSecurityPolicy: {
      directives: {
        frameAncestors: ["'self'"]
      }
    }
  })
);
app.use(session(sessionConfig));
app.use(
  keycloak.middleware({
    admin: "/callback",
    logout: "/logout"
  })
);

// app.use(morgan("combined"));
app.use(
  morgan(function(tokens, req, res) {
    return [
      process.pid,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms"
    ].join(" ");
  })
);
app.use(haltOnTimedout);

// Add Proxy
app.use("/ilp-api", keycloak.protect(), ilpApiProxy(express.Router()));

// below API is redirected because of mobile app wingspan which is already published
// app.all("/publicApi/*", (req, res) => {
//   res.redirect(CONSTANTS.HTTPS_HOST + "/clientApi" + req.url);
// });

app.use(
  "/public-assets",
  proxyCreatorRoute(express.Router(), CONSTANTS.WEB_HOST_PROXY + "/web-hosted/web-client-public-assets")
);

app.use("/content", keycloak.protect(), proxyCreatorRoute(express.Router(), CONSTANTS.CONTENT_API_BASE + "/content"));

app.use(
  "/web-hosted",
  keycloak.protect(),
  proxyCreatorRoute(express.Router(), CONSTANTS.WEB_HOST_PROXY + "/web-hosted")
);

app.use("/hosted", keycloak.protect(), proxyCreatorRoute(express.Router(), CONSTANTS.CONTENT_API_BASE + "/hosted"));

app.use("/fastrack", keycloak.protect(), proxyCreatorRoute(express.Router(), CONSTANTS.ILP_FP_PROXY + "/fastrack"));

app.use("/LA", keycloak.protect(), proxyCreatorRoute(express.Router(), CONSTANTS.LA_HOST_PROXY));

app.use(
  "/static-ilp",
  keycloak.protect(),
  proxyCreatorRoute(express.Router(), `${CONSTANTS.STATIC_ILP_PROXY}/static-ilp`)
);

// Serve UI
uiHostCreator("ar");
uiHostCreator("de");
uiHostCreator("es");
uiHostCreator("fr");
uiHostCreator("ja");
uiHostCreator("nl");
uiHostCreator("zh_CN");

function uiHostCreator(lang) {
  app.use(`/${lang}`, express.static(path.join(__dirname, `www/${lang}`)));
  app.get(`/${lang}/*`, (req, res) => {
    if (req.url.startsWith("/assets/")) {
      res.status(404).send("requested asset is not available");
    } else {
      res.sendFile(path.join(__dirname, `www/${lang}/index.html`));
    }
  });
}

app.use(`/`, express.static(path.join(__dirname, `www/en`)));
app.get(`/*`, (req, res) => {
  if (req.url.startsWith("/assets/")) {
    res.status(404).send("requested asset is not available");
  } else {
    res.sendFile(path.join(__dirname, `www/en/index.html`));
  }
});

app.use(haltOnTimedout);
app.listen(CONSTANTS.PORTAL_PORT, "0.0.0.0", err => {
  console.error(err || "No Error", `Server started at ${CONSTANTS.PORTAL_PORT}`);
});

function proxyCreatorRoute(appRoute, target) {
  const proxy = httpProxy.createProxyServer({
    proxyTimeout: CONSTANTS.TIMEOUT
  });
  appRoute.all("/*", (req, res) => {
    proxy.web(req, res, {
      target
    });
  });
  return appRoute;
}

function ilpApiProxy(appRoute) {
  const base = CONSTANTS.ILP_FP_PROXY;
  appRoute.post("/*", (req, res) => {
    request
      .post(base + req.url, {
        headers: {
          ...req.headers
        },
        json: req.body
      })
      .pipe(res);
  });
  appRoute.get("/*", (req, res) => {
    request
      .get(base + req.url, {
        headers: {
          ...req.headers
        }
      })
      .pipe(res);
  });
  return appRoute;
}
