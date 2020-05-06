/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const request = require('request');
const Uuid = require('cassandra-driver').types.Uuid;
const cassandraUtil = require('../CassandraUtil/cassandra');
const log = require('../Logger/log');
const { esUrl, authHeaders } = require('../ElasticsearchUtil/es-util');

function getAccessPathOfAUser(wid, rootOrg) {
  return new Promise((resolve, reject) => {
    const promiseArr = [getAccessPathsFromCassandra(wid, rootOrg), getGroupAccessPathsFromES(wid, rootOrg)];
    const accessPaths = new Set();
    Promise.all(promiseArr).then((values) => {
      const cassAP = values[0];
      const esAP = values[1];

      console.log('Cassandra response: ', cassAP);
      console.log('ES response: ', esAP);

      esAP.forEach(val => accessPaths.add(val));
      cassAP.access_paths.forEach(val => accessPaths.add(val));
      resolve({
        accessPaths: Array.from(accessPaths),
        org: cassAP.org
      });
    }).catch(ex => {
      console.error(ex);
      reject(ex)
    });
  });
}

function getAccessPathsFromCassandra(wid, rootOrg) {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM bodhi.user_access_paths WHERE root_org=? AND user_id=? ALLOW FILTERING';
    cassandraUtil.executeQuery(query, [rootOrg, wid], (err, result) => {
      if (!err && result && result.rows && result.rows.length>0) {
        resolve(result.rows[0]);
      } else {
        log.error('Error while fetching the access paths data.', err);
        reject(err);
      }
    });
  });
}

function getGroupAccessPathsFromES(wid, rootOrg) {
  return new Promise((resolve, reject) => {
    const requestObject = {
      _source: ['accessPaths'],
      query: {
        bool: {
          must: [
            {
              term: {
                userIds: wid
              }
            },
            {
              term: {
                rootOrg: rootOrg
              }
            }
          ]
        }
      }
    };

    const endPoint = `${esUrl}/accesscontrolgroups/_search?source=${JSON.stringify(
      requestObject
    )}&&source_content_type=application/json`;

    let options = {
      rejectUnauthorized: false,
      headers: authHeaders,
      url: endPoint
    };
    // const endPoint = `${esAddr}/_search?q=_id:${contentId}`;
    request(options, function (error, response, body) {
      if (error) {
        return reject(error);
      }
      body = JSON.parse(body);
      let accessPaths = new Set();
      if (body && body.hits && body.hits.hits) {
        body.hits.hits.forEach(element => {
          element._source.accessPaths.forEach(accessPaths.add, accessPaths);
        });
      }
      resolve(Array.from(accessPaths));
    });
  });
}

module.exports = {
  getAccessPathOfAUser,
}