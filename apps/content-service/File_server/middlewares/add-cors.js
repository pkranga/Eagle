/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const log = require('../Logger/log');

function checkConditionalCors(app, corsValue) {
  // Enabling the CORS for all requests if Dev and on prod environments, enabling only on the domain
  app.use((req, res, next) => {

    // Reading the current whitelist of the domains, if the reqyest's origin is from this domain, adding the header, else ignoring.
    if (corsValue !== undefined && corsValue !== null && corsValue !== '*') {
      const whiteListDomains = corsValue.split(',').map(val => val.trim());
      const currentOrigin = req.headers.origin;

      if (currentOrigin && whiteListDomains.includes(currentOrigin.trim())) {
        res.header('Access-Control-Allow-Origin', currentOrigin);
      } else {
        log.silly('The servers whitelist is empty');
      }
    } else {
      res.header('Access-Control-Allow-Origin', corsValue);
    }
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  });
}

module.exports = {
  checkConditionalCors
}
