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

function addRoutes(app) {
  /**
   * ROUTERS
   *
   * All the routes related to the application functionality are separated as per their action and their respective routes are defined in the directory with the suffix of '-router'
   */
  // AWS Routers
  // app.use('/aws', require('../Aws/content-router'));
  // Content router
  app.use('/content', require('../Content/content-router'));
  app.use('/contentv3', require('../S3/content-router'));
  app.use('/contentv2', require('../ContentV2/contentv2-router'));

  // Hosted content router
  app.use(require('../Hosted/hosted-router'));
  // Hierarchy router
  app.use(require('../Hierarchy/hierarchy-router'));
  // Access token router
  app.use(require('../AccessToken/accessToken-router'));
  // User related services route
  app.use(require('../User/user-router'));

  // Live Stream Router
  // app.use('/aws', require('../LiveStream/content-router'));
  // Open rap related services
  app.use('/openrap', require('../OpenRap/openRap-router'));
  // New continue learning API
  app.use('/continue', require('../Continue/router'));
  // Live events router
  app.use(require('../LiveEvents/router'));
  // Adding the email router
  app.use('/email', require('../EmailUtil/router'));

  // Enabling the app features conditionally on config
  const keyRouterMap = {
    stats: {
      path: '/stats',
      router: '../stats/router'
    },
    public_content: {
      path: '/public-content',
      router: '../Content/public-content-router'
    }
  };

  for (const key of Object.keys(keyRouterMap)) {
    const currentVal = keyRouterMap[key];
    if (config.getProperty(key) == '1') {
      console.log(`Enabling: ${currentVal.path}`); // eslint-disable-line
      app.use(currentVal.path, require(currentVal.router));
    }
  }

  app.get('/', async (req, res) => {
    try {
      let result = await require('../HealthUtil/util').checkHealth();
      // console.log('Result: ', result); // eslint-disable-line
      res.send(result);
    } catch (e) {
      console.error('Exception is: ', e); // eslint-disable-line
      res.status(500).send(e);
    }
  });

  app.get('/version', function(req, res) {
    res.send(`Version number: ${config.getProperty('build_number')}`);
  });

  // Adding the public endpoint
  app.use('/public', require('../PublicAPI/router'));
  // The 404 Route ;). Should add this later

  app.get('/health-check', (req, res) =>
    res.sendFile(__dirname + '/index.html')
  );

  // Starting the load balancer on config requirement
  if (config.getProperty('load_balancer') == '1') {
    require('../LoadBalancer/app');
  }
}

module.exports = {
  addRoutes,
}
