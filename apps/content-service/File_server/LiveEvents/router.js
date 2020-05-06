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
const util = require('./util');

var bodyParser = require('body-parser');

// Put these statements before you define any routes.
router.use(bodyParser.json({}));
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/live-events', async (req, res) => {
  try {
    const data = [
      req.body['event-name'],
      new Date(req.body['start-time']),
      req.body['event-url'],
      new Date(req.body['end-time'])
    ];

    await util.saveLiveEventData(data);
    res.status(201).send({
      msg: 'Saved'
    });
  } catch (e) {
    console.error(e); // eslint-disable-line
    res.status(500).send({
      msg: 'Error'
    });
  }
});

router.get('/live-events', async (req, res) => {
  try {
    let results = await util.getAllLiveEvents();
    if (req.headers.rootOrg) {
      results = results.filter(item => req.headers.rootOrg === item.root_org);
    }
    if (req.headers.rootOrg) {
      results = results.filter(item => req.headers.org === item.root_org);
    }
    // Removing the rootOrg and org keys so that the contract is maintained
    results = results.map(item => {
      delete item.root_org;
      delete item.org;
      return item;
    });
    res.send(results);
  } catch (e) {
    console.error(e); //eslint-disable-line
    res.status(500).send({
      msg: 'Error'
    });
  }
});

module.exports = router;
