/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
const ADDRESS = {
  API: ["/clientApi/*"],
  NODE_PROXY: [
    "/content/*",
    "/public-assets/*",
    "/static-ilp/*",
    "/web-hosted/*",
    "/hosted/*",
    "/publicApi/*",
    "/LA/*",
    "/fastrack/*",
    "/ilp-api/*",
    "/toc-analytics/*",
    "/static/*"
  ],
  NGX_PROXIED: ["/chat-bot/*", "/mobile-apps/*", "/LA1/*"]
};

const getConfig = target => ({
  target,
  secure: false,
  logLevel: "debug"
});

const getApiConfig = target => ({
  target,
  secure: false,
  logLevel: "debug",
  pathRewrite: {
    "/clientApi": "/"
  }
});

module.exports = function(ngxProxyAddress, nodeProxyAddress, apiAddress) {
  const ngxProxyConfig = getConfig(ngxProxyAddress);
  const nodeProxyConfig = getConfig(nodeProxyAddress);
  const apiConfig = apiAddress === nodeProxyAddress ? getConfig(apiAddress) : getApiConfig(apiAddress);
  return ADDRESS.NODE_PROXY.reduce(
    (agg, u) => {
      agg[u] = nodeProxyConfig;
      return agg;
    },
    ADDRESS.NGX_PROXIED.reduce(
      (agg, u) => {
        agg[u] = ngxProxyConfig;
        return agg;
      },
      ADDRESS.API.reduce((agg, u) => {
        agg[u] = apiConfig;
        return agg;
      }, {})
    )
  );
};
