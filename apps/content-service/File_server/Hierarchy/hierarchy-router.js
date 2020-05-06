/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const express = require('express');
const router = express.Router();
const log = require('../Logger/log');
const appUtil = require('../AppUtil/util');
const metaUtil = require('../Meta/util');
const cacheService = require('../CacheService/cache-service');
/**
 * This will serve the hierarchy API. Here we are not using the cache from the apiCache library because we are running the app as a cluster and each worker in the cluster will be requesting for the hierarchy every time there is a request. Hence we are storing the data globally shared among the workers in the cluster and then checking if the data exists or not then serving the request.
 */
var hierarchy = require('./hierarchy');
const cacheHourLimit = hierarchy.cacheHours;

const uiLiteQueryParamValue = 'UI_LITE';

const defaultFields = ['identifier', 'children', 'status', 'accessPaths'];

function getHierarchyDataAndSave(contentId, params, saveInCache, options) {
  return new Promise((resolve, reject) => {
    hierarchy
      .getHierarchyData(contentId, params, options)
      .then(hierarchyRes => {
        try {
          resolve(hierarchyRes);
          if (saveInCache) {
            cacheService.set(contentId, {
              savedDate: new Date(),
              data: hierarchyRes
            });
            log.info('Saved the saved to cache');
          }
        } catch (e) {
          console.error(e); // eslint-disable-line
        }
      })
      .catch(e => {
        console.error(e); // eslint-disable-line
        reject(e);
      });
  });
}

router.get('/hierarchy/:contentId', (req, res) => {
  processHierarchyRequest(req, res);
});
router.post('/hierarchy/:contentId', (req, res) => {
  processHierarchyRequest(req, res);
});

function processHierarchyRequest(req, res) {
  let { wid, rootorg } = req.headers;

  // wid = '9c204d70-1d34-41a7-91f1-c6b5aafaf7eb';
  wid = 'a5881ba2-3666-41f1-95da-6c7aff7806d3';
  rootorg = 'Infosys';
  if (req.body) {
    if (req.body.userId) {
      wid = req.body.userId;
    }
    if (req.body.rootOrg) {
      rootorg = req.body.rootOrg;
    }
  }
  if (!wid || !rootorg) {
    return res.status(400).send({
      code: 400,
      msg: 'Invalid wid and rootorg values',
    });
  }

  const options = {
    wid: wid,
    rootOrg: rootorg,
  };

  /**
   * Sample cache structure
   * {
   * 	'lex_123': {
   * 		'savedDate': Date(),
   * 		'data': <data json>
   * 	}
   * }
   */
  // Adding a new functionality, where the _source field is passed to the hierarchy
  let sourceField = new Set();
  if (req.query.dt && req.query.dt === uiLiteQueryParamValue) {
    sourceField = metaUtil.UI_LITE_KEYS;
  }
  try {
    if (req.query._source) {
      const querySourceFields = JSON.parse(req.query._source);
      if (querySourceFields instanceof Array) {
        querySourceFields.forEach(source => sourceField.add(source));
        // sourceField = new Set(...sourceField, ...querySourceFields);
      }
    }
  } catch (e) {
    if (e instanceof SyntaxError) {
      res.status(400).send({
        code: 400,
        msg: 'Invalid _source field. Source field must be a JSON object',
        error: e.message
      });
    } else {
      res.status(500).send({
        code: 500,
        msg: 'Error while processing the request'
      });
    }
    console.error(e); //eslint-disable-line
    return;
  }

  let shouldSaveCache = false;
  if (sourceField && sourceField.size > 0) {
    defaultFields.map(val => sourceField.add(val));
  } else {
    shouldSaveCache = true;
  }

  const contentId = req.params.contentId;
  const currentCacheContent = cacheService.get(contentId);

  var force = false;
  if (req.query.force && req.query.force == 1) {
    force = true;
  }

  let responseSentBack = false;

  // Checking if the cached data can be sent
  if (
    !force &&
    currentCacheContent &&
    (!sourceField || (sourceField && sourceField.size === 0))
  ) {
    if (currentCacheContent.savedDate) {
      if (
        appUtil.getDateDifferenceInHours(
          new Date(),
          currentCacheContent.savedDate
        ) > cacheHourLimit
      ) {
        // Send whatever data is available back to the user and update the hierarchy later
        if (currentCacheContent.data) {
          // Sending the data back to the user and updating the cache later
          log.info('Sending the (n+1) cached response');
          res.send(currentCacheContent.data);
          responseSentBack = true;
        }
      } else {
        // Cache is available and fresh
        // Data is present and is good
        log.info('Sending the cached response');
        // res.send(hierarchy.hierarchyCache[contentId].data);
        res.send(cacheService.get(contentId).data);
        // hierarchyCallRequired = false;
        return;
      }
    }
  }
  // If cached data was there, response would have been sent back. Now we call hierarchy for
  // 1. Either no cache data was there
  // 2. Forced request
  // 3. Request with a source field
  // 4. Cache expiring soon, so update required
  let paramsObj = {};
  if (sourceField && sourceField.size > 0) {
    paramsObj._source = [...sourceField];
  }
  getHierarchyDataAndSave(contentId, paramsObj, shouldSaveCache, options)
    .then((result) => {
      // Checking if caches response has already been sent back.
      if (!responseSentBack) {
        // Sendinf the response now
        res.send(result);
      }
    })
    .catch(e => {
      console.error(e);
      if (!e || !e.params) {
        e = {
          params: {
            status: 500,
          }
        };
      }
      res.status(e.params.status).send(e);
    });
}

router.get('/all-ids/:contentId', (req, res) => {
  hierarchy.getAllIds(req.params.contentId, req.query.index, function (allIds) {
    res.send(allIds);
  });
});

router.post('/all-ids/list', (req, res) => {
  const contentIds = req.body;
  let responseJson = {};
  let finishedCount = 0;

  contentIds.forEach(contentId => {
    hierarchy.getAllIds(contentId, req.query.index, function (allIds) {
      responseJson[contentId] = allIds;
      if (++finishedCount == contentIds.length) {
        res.send(responseJson);
      }
    });
  });
});

router.get(
  '/meta-children/level/1/:contentId',
  filterMetaAndMetaChildrenRequest,
  (req, res) => {
    // Request for source field is properly formed;
    // Example : lex_33493780988125323000
    hierarchy
      .getChildrenMeta(req.params.contentId, {
        _source: req.sourceArr
      })
      .then(result => {
        res.send(result);
      })
      .catch(e => {
        console.error(e); //  eslint-disable-line
        res.status(500).send(e);
      });
  }
);

/**
 * Depreciation. Will be removed in the coming versions, replaced with v2
 */
router.get(
  '/meta/:contentIdCSL',
  filterMetaAndMetaChildrenRequest,
  (req, res) => {
    processMetaRequest(req, res, 1);
  }
);

router.get(
  '/meta/v2/:contentIdCSL',
  filterIdentifiersList,
  filterMetaAndMetaChildrenRequest,
  (req, res) => {
    processMetaRequest(req, res, 2);
  }
);

function processMetaRequest(req, res, version) {
  // Request for source field is properly formed;
  // Example : lex_33493780988125323000, lex_33493780988125323000
  const contentIds = new Set(
    req.params.contentIdCSL.split(',').map(val => val.trim())
  );
  let promiseArr = [];

  contentIds.forEach(contentId => {
    promiseArr.push(
      hierarchy.getIdentifierData(contentId, { _source: req.sourceArr })
    );
  });

  /**
   * Beautiful piece of code. Save it
   */
  const rejectedCode = 'REJECTED';
  const fulfilledCode = 'FULFILLED';

  const catchHandler = error => ({
    payload: error,
    status: rejectedCode
  });

  const successHandler = result => ({
    payload: result,
    status: fulfilledCode
  });

  const returnResult = {
    failed: {}
  };
  Promise.all(
    promiseArr.map(result => result.then(successHandler).catch(catchHandler))
  ).then(values => {
    if (version === 1) {
      values[0].status === rejectedCode
        ? res.status(values[0].payload.code).send(values[0].payload.code)
        : res.send(values[0].payload);
      return;
    }
    values
      // .filter(val => val.status === fulfilledCode)
      .map(val => {
        if (val.status === rejectedCode) {
          returnResult.failed[val.payload.identifier] = val.payload;
        } else {
          returnResult[val.payload.identifier] = val.payload;
        }
      });
    res.send(returnResult);
  });
}

router.delete('/hierarchy-cache/:identifier', (req, res) => {
  if (req.params.identifier) {
    if (req.params.identifier === '*') {
      cacheService.removeAll();
    } else {
      cacheService.remove(req.params.identifier);
    }
    res.status(204).send();
    return;
  }
  res.status(400).send({
    code: 400,
    msg: 'Invalid identifier'
  });
});

function filterIdentifiersList(req, res, next) {
  if (req.params.contentIdCSL.split(',').length < 1) {
    res.status(400).send({
      msg: 'Bad request, identifiers must be a comma seperated list',
      code: 400
    });
    return;
  }
  next();
}
function filterMetaAndMetaChildrenRequest(req, res, next) {
  let sourceArr = [];
  try {
    if (req.query._source) {
      sourceArr = JSON.parse(req.query._source);
      if (!(sourceArr instanceof Array)) {
        res.status(400).send({
          code: 400,
          msg:
            '_source field should be an array of strings. Other formats are not accepted'
        });
        return;
      }
    }
    if (req.query.dt && req.query.dt === uiLiteQueryParamValue) {
      // sourceArr = sourceArr.concat([...metaUtil.UI_LITE_KEYS]);
      sourceArr = new Set([...sourceArr, ...metaUtil.UI_LITE_KEYS]);
    }
    req.sourceArr = [...sourceArr];
    next();
  } catch (e) {
    if (e instanceof SyntaxError) {
      res.status(400).send({
        code: 400,
        msg: 'Invalid _source field. Source field must be a array of strings',
        error: e.message
      });
    } else {
      res.status(500).send({
        code: 500,
        msg: 'Error while processing the request'
      });
    }
    console.error(e); //eslint-disable-line
  }
}
module.exports = router;
