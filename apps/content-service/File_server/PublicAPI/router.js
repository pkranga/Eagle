/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const router = require('express').Router();
const fs = require('fs');

// Adding the Keycloak protection
const Keycloak = require('keycloak-connect');
const session = require('express-session');
const appConfig = require('../ConfigReader/loader');

const cassandraHost = require('../ConfigReader/loader').getProperty('cassandra_host');

if (!cassandraHost) {
  throw new Error('Invalid host received for cassandra');
}

// Changes for cassandra password authentication
const cassandra = require('cassandra-driver');
const CassandraStore = require('cassandra-store');
let cassandraUserName = appConfig.getProperty('cassandra_username');
let cassandraPassword = appConfig.getProperty('cassandra_password');
var authProvider = new cassandra.auth.PlainTextAuthProvider(cassandraUserName, cassandraPassword);
// --------------------------------------------------------

const cassandraStoreConfig = {
  table: 'sessions',
  client: null,
  clientOptions: {
    contactPoints: [cassandraHost],
    keyspace: 'portal',
    queryOptions: {
      prepare: true
    },
    // Added for cassandra password authentication
    authProvider: authProvider
  }
};

const sessionConfig = {
  secret: '',
  resave: false,
  // saveUninitialized: false,
  saveUninitialized: true,
  store: new CassandraStore(cassandraStoreConfig)
};

const keycloak = new Keycloak({
    store: sessionConfig.store
  }, {
    serverUrl: `${appConfig.getProperty('https_host')}/auth`,
    bearerOnly: true,
    realm: appConfig.getProperty('keycloak_realm'),
    // resource: 'portal',
    'ssl-required': 'none'
  }
);
router.use(session(sessionConfig));
router.use(keycloak.middleware());

let s3Util = require('../S3/util');

/**
 * Get the encrypted data key from S3
 */
router.get('/getKey/*', (req, res) => {
  let location = req.params['0'];
  s3Util.getKey(location).then(key => {
    // Disable caching for key
    // res.header("Cache-Control", "no-cache, no-store");
    // res.header("Pragma", "no-cache");
    res.status(200).send(key);
  }).catch(err => res.send(err));
});

router.get('/enckey/*', keycloak.protect(), (req, res) => {
  try {
    let location = req.params['0'];
    let resourceDir = `${appConfig.getProperty('resource_directory')}/${appConfig.getProperty('transcoding_enc_dir_name') || 'enc_keys'}/${location}`;

    console.log('Location for enc key: ', resourceDir);

    // Check if key exists
    if (fs.existsSync(resourceDir)) {
      // If the key is directory, return a bad request
      if (fs.lstatSync(resourceDir).isDirectory()) {
        res.status(400).send({
          code: 400,
          message: 'Bad request. Cant serve a directory'
        })
      }
      // Serve the key
      else {
        // Deploy test
        res.status(200).send(fs.readFileSync(resourceDir));
        // res.send({
        // 	code : 200,
        // 	Body : fs.readFileSync(resourceDir)
        // });
      }
    }
    // Key not found
    else {
      res.status(404).send({
        code: 404,
        message: 'Key not found'
      });
    }
  }
  catch (err) {
    console.log(err);
    res.send({
      code: 500,
      message: 'Internal Server Error'
    })
  }

});

module.exports = router;
