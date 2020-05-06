/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Request to get the data from ES
const request = require('request');

// uuid generator
const uuidv1 = require('uuid/v1');

const log = require('../Logger/log');

// Config loader
const config = require('../ConfigReader/loader');

// App util
const appUtil = require('../AppUtil/util');

// EsUtil
const esUtil = require('../ElasticsearchUtil/es-util');

const accessPathsUtil = require('../access-paths-util/util');

// Elasticsearch configurations
const esIndex = config.getProperty('es_index_name');
const esUrl = esUtil.esUrl;
const esAuthHeaders = esUtil.authHeaders;
const esAddr = `${esUrl}/${esIndex}`;

// Cache model, used to store the cached hierarchy response
let hierarchyCache = {};
const cacheHours = 6;

const ERROR_MSGS = {
  NOT_FOUND: 'NOT_FOUND',
  INVALID_HIERARCHY: 'INVALID_HIERARCHY',
  SERVER_ERROR: 'SERVER_ERROR'
};

// This method will get the data for a content and send the hierarchy data of the item respectively as per the data of the children in the order they are mentioned in the content API.
function getHieraricalDataForContentId(contentId, params, extraData, callback) {
  
  try {
    if (!contentId) {
      throw 'Content Id cannot be null';
    }
    // console.log('Options is: ', opts);

    // const searchObject = {
    //   ...params,
    //   query: {
    //     term: {
    //       'identifier': {
    //         value: contentId
    //       }
    //     }
    //   }
    // };

    // const searchObject = {
    //   ...params,
    //   query: {
    //     bool: {
    //       must: [
    //         {
    //           terms: {
    //             identifier: [contentId]
    //           }
    //         },
    //         {
    //           terms: {
    //             status: ["Live", "Expired", "Deleted", "MarkedForDeletion"]
    //           }
    //         }
    //       ]
    //     }
    //   }
    // };

    // console.log('Extra data', extraData);

    const allowedStatus = ['Live', 'Expired', 'Deleted', 'MarkedForDeletion'];
    const searchObject = {
      ...params,
      query: {
        bool: {
          filter: [
            {
              terms: {
                identifier: [contentId]
              }
            },
            {
              terms: {
                status: allowedStatus
              }
            },
            {
              terms: {
                accessPaths: extraData.accessPaths // ['Infosys', 'Infosys/Infosys Ltd'] User access paths, cassandra
              }
            },
            {
              term: {
                rootOrg: extraData.rootOrg// "Infosys" // RequestHeader
              }
            },
            {
              nested: {
                query: {
                  bool: {
                    must: [
                      {
                        terms: {
                          'org.org': [extraData.org] // User access paths, cassandra
                        }
                      },
                      {
                        range: {
                          'org.validTill': {
                            from: 'now',
                            to: null,
                            include_lower: true,
                            include_upper: true
                          }
                        }
                      }
                    ],
                    adjust_pure_negative: true,
                    boost: 1
                  }
                },
                path: 'org',
                ignore_unmapped: false,
                score_mode: 'avg'
              }
            }
          ]
        }
      }
    };

    // console.log('Search object', searchObject);
    const endPoint = `${esUrl}/mlsearch_en/_search?source=${JSON.stringify(
      searchObject
    )}&&source_content_type=application/json`;

    let options = {
      rejectUnauthorized: false,
      headers: esAuthHeaders,
      url: endPoint
    };
    // const endPoint = `${esAddr}/_search?q=_id:${contentId}`;
    request(options, function (error, response, body) {
      try {
        if (error) {
          log.error(error);
          callback(error, null);
        } else {
          if (callback) {
            let bodyObj = JSON.parse(body);

            if (
              bodyObj.hits &&
              bodyObj.hits.hits &&
              bodyObj.hits.hits.length > 0
            ) {
              let contentObj = bodyObj.hits.hits[0]._source;

              let contentChildren = contentObj.children.filter(child => {
                if (!child.identifier.endsWith('.img') && allowedStatus.includes(child.status)){
                  return child;
                } else {
                  console.log('Deleted id: ', child);
                }
              });
              if (contentChildren.length > 0) {
                let respCount = 0;
                contentChildren.forEach((child, index) => {
                  getHieraricalDataForContentId(child.identifier, params, extraData, function (
                    err,
                    body
                  ) {
                    if (err) {
                      if (err.message === ERROR_MSGS.NOT_FOUND) {
                        console.error(
                          // eslint-disable-line
                          'child resource not found: ',
                          child.identifier
                        );
                        callback(new Error(ERROR_MSGS.INVALID_HIERARCHY), null);
                        // throw new Error('Invalid hierarchy');
                      } else {
                        callback(err, null);
                      }
                      return;
                    }
                    if (body) {
                      respCount++;
                      if (
                        params._source &&
                        body.children &&
                        !params._source.includes('children') &&
                        body.children.length === 0
                      ) {
                        // delete body.children;
                      }
                      contentChildren[index] = body;

                      // console.log('Body is: ', body);
                      if (respCount == contentChildren.length) {
                        contentObj.children = contentChildren;
                        callback(null, contentObj);
                      }
                    } else {
                      console.error('Body is', body); // eslint-disable-line
                      console.error('Error is, ', err); // eslint-disable-line
                      callback(new Error(ERROR_MSGS.SERVER_ERROR), null);
                    }
                  });
                });
              } else {
                callback(null, contentObj);
              }
            } else {
              callback(new Error(ERROR_MSGS.NOT_FOUND), null);
            }
          } else {
            console.error('No place to send data'); // eslint-disable-line
            throw new Error('Callback is required');
          }
        }
      } catch (e) {
        // log.error(e);
        console.error('Error is: ', e); // eslint-disable-line
        let error = new Error(ERROR_MSGS.SERVER_ERROR);
        if (e.message === ERROR_MSGS.INVALID_HIERARCHY) {
          error.message = ERROR_MSGS.INVALID_HIERARCHY;
        }
        callback(error, null);
      }
    });
  } catch (e) {
    console.error(e); // eslint-disable-line
    throw e;
  }
}

// Gets the hierarchy data of a content and will mostly call the method in a recursive manner.
function getHierarchyData(contentId, params, options) {
  // Adding the default data for the object like EkStep
  let respObj = {};
  respObj.id = 'api.course.hierarchy';
  respObj.ver = '0.1';
  respObj.ts = new Date().toISOString();
  respObj.params = {
    status: 500
  };

  return new Promise((resolve, reject) => {
    // Checking for valid content id
    if (!validateGetHierarchyDataInput(contentId)) {
      log.error('Content id is empty or null or not a string');
      respObj.params = {
        resmsgid: uuidv1(),
        msgid: uuidv1(),
        status: '400',
        err: 'Bad request',
        errmsg: 'ContentId cannot be empty'
      };
      respObj.responseCode = 'Bad request';
      reject(respObj);
    }

    try {
      // Getting the access paths for the user.
      accessPathsUtil.getAccessPathOfAUser(options.wid, options.rootOrg).then((apResponse) => {

        options.accessPaths = apResponse.accessPaths;
        options.org = apResponse.org;

        getHieraricalDataForContentId(contentId, params, options, function (err, body) {
          if (body) {
            respObj.params = {
              resmsgid: uuidv1(),
              msgid: uuidv1(),
              status: '200',
              err: null,
              errmsg: null
            };
            respObj.responseCode = 'OK';
            respObj.result = {};
            respObj.result.content = body;
            // resolve(respObj);
            resolve(body);
          }
          if (err && err.message == ERROR_MSGS.NOT_FOUND) {
            respObj.params = {
              resmsgid: uuidv1(),
              msgid: uuidv1(),
              status: '404',
              err: 'Not found',
              errmsg: 'Resource not found'
            };
            respObj.responseCode = 'NOT FOUND';
          }
          if (err && err.message == ERROR_MSGS.INVALID_HIERARCHY) {
            respObj.params = {
              resmsgid: uuidv1(),
              msgid: uuidv1(),
              status: '400',
              err: 'Bad request',
              errmsg: 'Hierarchy is not complete for the requested resource'
            };
            respObj.responseCode = 'INVALID STRUCTURE';
          }
          if (err && err.message == ERROR_MSGS.SERVER_ERROR) {
            respObj.params = {
              resmsgid: uuidv1(),
              msgid: uuidv1(),
              status: '500',
              err: 'Error',
              errmsg: 'Internal Server Error'
            };
            respObj.responseCode = 'INTERNAL SERVER ERROR';
          }
          reject(respObj);
        });
      }).catch(ex => {
        console.error(ex);
        reject(ex);
      });
    } catch (e) {
      log.error(e);
      respObj.params = {
        resmsgid: uuidv1(),
        msgid: uuidv1(),
        status: '500',
        err: 'Error',
        errmsg: 'Internal Server Error'
      };
      respObj.responseCode = 'Internal Server Error';
      reject(respObj);
    }
  });
}

function validateGetHierarchyDataInput(contentId) {
  if (
    !contentId ||
    contentId.toString().trim().length < 1 ||
    contentId instanceof Array ||
    typeof contentId != 'string'
  ) {
    return false;
  }
  return true;
}

function getHierarichalIds(contentId, indexName, callback) {
  var childrenIds = [];

  getChildIdsFromHierarchy(contentId, indexName, childrenIds, function (idsArr) {
    callback(idsArr);
  });
}

function getChildIdsFromHierarchy(contentId, indexName, idsArr, callback) {
  try {
    if (!contentId) {
      throw 'Content Id cannot be null';
    }
    const endPoint = `${esUrl}/${indexName}/_search?q=_id:${contentId}`;

    let options = {
      rejectUnauthorized: false,
      headers: esAuthHeaders,
      url: endPoint //+ '&&source_content_type=application/json'
    };

    request(options, function (error, response, body) {
      try {
        if (error) {
          log.error('Error from request get');
          log.error(error);
          callback(null);
        }
        if (!error) {
          if (callback) {
            var bodyObj = JSON.parse(body);

            if (
              bodyObj.hits &&
              bodyObj.hits.hits &&
              bodyObj.hits.hits.length > 0
            ) {
              var contentObj = bodyObj.hits.hits[0]._source;

              var contentChildren = contentObj.children;

              if (contentChildren.length > 0) {
                var respCount = 0;
                for (var i = 0; i < contentChildren.length; i++) {
                  (function (index) {
                    getChildIdsFromHierarchy(
                      contentChildren[index].identifier,
                      indexName,
                      idsArr,
                      function (childArr) {
                        if (childArr !== null) {
                          respCount++;
                          childArr.push(contentObj.identifier);
                          if (respCount == contentChildren.length) {
                            callback(childArr);
                          }
                        }
                      }
                    );
                  })(i);
                }
              } else {
                idsArr.push(contentObj.identifier);
                callback(idsArr);
              }
            } else {
              // notFound = true;
              log.error('Resource not found for :' + contentId);
              log.error('Hits is:', bodyObj.hits);
              log.error('Hits.hits is:', bodyObj.hits.hits);
              log.error('Hits.hits.length is:', bodyObj.hits.hits.length);
              callback(idsArr);
            }
          }
        }
      } catch (e) {
        log.error('Exception while making the request');
        console.error(e); // eslint-disable-line
        callback(idsArr);
      }
    });
  } catch (e) {
    log.error('Exception while creating the ES URL');
    log.error(e);
    throw e;
  }
}

function getAllIds(contentId, index, callback) {
  let indexName = index || config.getProperty('es_index_name');

  getHierarichalIds(contentId, indexName, function (ids) {
    callback(ids.filter(onlyUnique));
  });
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function getIdentifierMeta(contentId, params) {
  // Right now only reading the _source of the params. Later we might add other objects as well
  return new Promise((resolve, reject) => {
    try {
      let sourceArr = [];

      if (params._source) {
        if (!(params._source instanceof Array)) {
          reject({
            code: 400,
            msg: '_source field is expected to be an array of strings'
          });
          return;
        }
        if (params._source.length > 0) {
          sourceArr = sourceArr.concat(params._source).concat('identifier');
        }
      }
      // Making the request object
      const searchObject = {
        _source: sourceArr,
        query: {
          term: {
            'identifier.keyword': {
              value: contentId
            }
          }
        }
      };

      const requestParams = {
        rejectUnauthorized: false,
        headers: esAuthHeaders,
        method: 'post',
        url: `${esAddr}/_search`,
        json: true,
        body: searchObject
      };

      // Making the request to get the data for the identifier
      request(requestParams, function (error, response, body) {
        if (error) {
          console.error(error); // eslint-disable-line
          reject(error);
        } else {
          if (response.statusCode !== 200) {
            reject(body);
          } else {
            resolve(body);
          }
        }
      });
    } catch (e) {
      console.error(e); // eslint-disable-line
      reject(e);
    }
  });
}

function getChildrenMeta(contentId, params) {
  const INTERNAL_SERVER_ERROR = {
    code: 500,
    msg: 'Internal server error'
  };
  return new Promise((resolve, reject) => {
    getIdentifierMeta(contentId, { _source: ['children.identifier'] })
      .then(bodyObj => {
        try {
          if (bodyObj.hits && bodyObj.hits.hits) {
            if (bodyObj.hits.hits.length === 0) {
              reject({
                code: 404,
                msg: 'No children available for this resource'
              });
              return;
            }
            if (bodyObj.hits.hits.length > 1) {
              reject({
                code: 500,
                msg: 'Multiple identifiers found for this identifier'
              });
              return;
            }
            // If the source field returned is empty, that means that the children's and their identifier does not exist. Return back saying that children who have identifiers does not exist for this resource
            if (
              bodyObj.hits.hits[0]._source &&
              (appUtil.isEmpty(bodyObj.hits.hits[0]._source) ||
                !bodyObj.hits.hits[0]._source.children)
            ) {
              reject({
                code: 404,
                msg: 'No children found for this identifier'
              });
              return;
            }

            // console.log('Fisrt condition', appUtil.isEmpty(bodyObj.hits.hits[0]._source));
            // console.log('Second condition is', JSON.stringify(bodyObj.hits.hits[0]._source));
            // console.log('Mapping data is', bodyObj.hits.hits[0]._source.children);
            // Get the children ids
            let childIdsArr = []; // used later to return the results in proper order.
            const childIdsObjArr = bodyObj.hits.hits[0]._source.children.map(
              child => {
                childIdsArr.push(child.identifier);
                let returnChildObj = {
                  _id: child.identifier
                };
                if (params._source) {
                  returnChildObj._source = params._source;
                }
                return returnChildObj;
              }
            );

            const childMgetRequestOptions = {
              method: 'POST',
              url: `${esAddr}/_mget`,
              json: true,
              body: {
                docs: childIdsObjArr
              },
              rejectUnauthorized: false,
              headers: esAuthHeaders
            };

            request(childMgetRequestOptions, function (error, response, body) {
              if (error) {
                console.error(error); // eslint-disable-line
                reject(INTERNAL_SERVER_ERROR);
                return;
              }
              if (response.statusCode !== 200) {
                console.error(
                  'Error while fetching the result from the es',
                  body
                ); // eslint-disable-line
                reject(INTERNAL_SERVER_ERROR);
                return;
              }

              const resultArr = [];
              if (body.docs && body.docs.length > 0) {
                // Iterating over the childIds array and getting the result of the ids in the proper order
                childIdsArr.forEach(childId => {
                  resultArr.push(
                    body.docs.filter(child => child._id === childId)[0]._source
                  );
                });
                resolve(resultArr);
              } else {
                reject({
                  code: 400,
                  msg: 'Children response not properly formed'
                });
                return;
              }
            });
          } else {
            reject(INTERNAL_SERVER_ERROR);
            return;
          }
        } catch (e) {
          console.error(e); // eslint-disable-line
          reject(INTERNAL_SERVER_ERROR);
        }
      })
      .catch(e => {
        console.error('Exception is: ', e); // eslint-disable-line
        reject(INTERNAL_SERVER_ERROR);
      });
  });
}

function getIdentifierData(contentId, params) {
  return new Promise((resolve, reject) => {
    getIdentifierMeta(contentId, params)
      .then(result => {
        if (result.hits) {
          if (result.hits.total === 0) {
            reject({
              code: 404,
              msg: `Content with the identifier ${contentId} not found`,
              identifier: contentId
            });
          } else if (result.hits && result.hits.hits > 1) {
            reject({
              code: 400,
              msg: `Multiple values found for the identifier ${contentId}`,
              identifier: contentId
            });
          } else {
            resolve(result.hits.hits[0]._source);
          }
        } else {
          reject({
            code: 500,
            msg: 'Error occured processing the request',
            identifier: contentId
          });
        }
      })
      .catch(e => {
        reject(e);
      });
  });
}

function getHierarchyDatav2(contentId, params) {

}

module.exports = {
  getHierarchyData,
  hierarchyCache,
  cacheHours,
  getAllIds,
  getHierarichalIds,
  getChildrenMeta,
  getIdentifierData
};
