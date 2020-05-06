/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const config = require('../ConfigReader/loader');
const logger = require('./app-logger');
const security = require('./helmet-security');
const compression = require('./enable-compression');
const cors = require('./add-cors');
const cache = require('./add-cache-disabler');
const bodyParser = require('./body-parser');
const favicon = require('./add-favicon');

function enable(app) {
  const enableFullCors = config.getProperty('enable_full_cors');
  const corsValue =
    enableFullCors == 0 ? config.getProperty('cors_domain_url') : '*';

  // Adding the morgan loggin
  logger.addLogger(app);
  // Helmet security
  security.addSecurity(app);
  // Enable compression
  compression.enable(app);

  // Eanabling the conditional Cors
  cors.checkConditionalCors(app, corsValue);

  // Disabling cache for API calls
  cache.disbaleCache(app);

  // Adding the body parser for accpeting post body
  bodyParser.addBodyParser(app);

  // Adding the favicon
  favicon.addFavicon(app);
}

module.exports = {
  enable
};
