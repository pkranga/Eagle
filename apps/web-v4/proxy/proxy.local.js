/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
const proxyAddr = require("./proxy.util");

const apiAddress = "http://localhost:3003";
// const nodeProxyAddress = "http://localhost:3002";
const nodeProxyAddress = "https://IP-ADDR";
const ngxProxyAddress = "https://IP-ADDR";

module.exports = proxyAddr(ngxProxyAddress, nodeProxyAddress, apiAddress);
