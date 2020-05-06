/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// Express for router
const express = require('express');
// Config loader
const config = require('./ConfigReader/loader');

const port = config.getProperty('port');
if (port === null || port === '') {
  throw 'Application port is not configured';
}
// Initializing the server
const app = express();


// Adding the middleware
require('./middlewares/add-middlewares').enable(app);
// Adding the routes
require('./routes/add-routes').addRoutes(app);

const appName = 'content-service';
const server = app.listen(port, () => {
  console.log(
    `\n\t\t==============================================================================
	\t|| Successfully started the server with app ${appName} on port: ${port} || \n
	\t==============================================================================`
  );
}); //eslint-no-indent

// Exporting the server for unit tests and worker creation
module.exports = server;

process.stdin.resume(); //so the program will not close instantly

function exitHandler(options, err) {
  if (options.cleanup) console.log('clean'); // eslint-disable-line
  if (err) console.log(err); // eslint-disable-line
  if (options.exit) process.exit();
}

// Do something when app is closing
process.on(
  'exit',
  exitHandler.bind(null, {
    cleanup: true
  })
);

//catches ctrl+c event
process.on(
  'SIGINT',
  exitHandler.bind(null, {
    exit: true
  })
);

// catches 'kill pid' (for example: nodemon restart)
process.on(
  'SIGUSR1',
  exitHandler.bind(null, {
    exit: true
  })
);
process.on(
  'SIGUSR2',
  exitHandler.bind(null, {
    exit: true
  })
);

//catches uncaught exceptions
process.on(
  'uncaughtException',
  exitHandler.bind(null, {
    exit: false
  })
);

process.on(
  'unhandledRejection',
  exitHandler.bind(null, {
    exit: false
  })
);
