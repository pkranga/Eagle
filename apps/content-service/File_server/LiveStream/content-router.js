/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Router for AWS Live Streaming

const router = require('express').Router();

let util = require('./util');

/**
 * @apiDescription API endpoint to get the RTMP url for a specific channel
 * @api {GET} /livestream/rtmp/:channel
 * @apiName getRTMPURL
 * @apiGroup LiveStream
 * @apiParam (URI Param) {String} channel Channel for which you need to get the RTMP url
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * {
 *  "code":200,
 *  "Urls":[
 *      ]
 * }
 * 
 * @apiError (Response Error) Channel not found 
 * @apiErrorExample Error-Response: 404
 * {
 *  "code":404,
 *  "error":"No medialive input with name:  wrongChannel"
 * }
 * 
 * @apiError (Response Error) Internal Server Error
 * @apiErrorExample Error-Response: 500
 * {
 *  "code" : 500,
 *  "error" : "Internal server error"
 * }
 */
router.get('/livestream/rtmp/:channel', (req, res) => {
    let channel = req.params.channel;

    util.getRTMPURL(channel)
        .then(result => res.send(result))
        .catch(err => res.send(err));
});


/**
 * @apiDescription API endpoint to get the streaming endpoint(Cloudfront domain) for a specific channel
 * @api {GET} /livestream/streamingendpoint/:channel
 * @apiName getEndpointURL
 * @apiGroup LiveStream
 * @apiParam (URI Param) {String} channel Channel for which you need to get the streaming endpoint
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * {
 *  "code":200,
 *  "url":"Domain/metadata.m3u8"
 * }
 * 
 * @apiError (Response Error) Channel not found 
 * @apiErrorExample Error-Response: 404
 * {
 *  "code":404,
 *  "message":"URL for this channel could not be found"
 * }
 * 
 * @apiError (Response Error) Internal Server Error
 * @apiErrorExample Error-Response: 500
 * {
 *  "code" : 500,
 *  "error" : "Internal server error"
 * }
 */
router.get('/livestream/streamingendpoint/:channel', (req, res) => {
    let channel = req.params.channel;

    res.send(util.getEndpointURL(channel));
});

/**
 * @apiDescription API endpoint to start a channel
 * @api {POST} /livestream/channel/start/:channel
 * @apiName startChannel
 * @apiGroup LiveStream
 * @apiParam (URI Param) {String} channel Channel which you need to start
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * {
 *  "code":202,
 *  "message":"Channel is starting now. Current state: STARTING"
 * }
 * 
 * @apiError (Response Error) Channel not found 
 * @apiErrorExample Error-Response: 404
 * {
 *  "code":404,
 *  "error":"Channel not found"
 * }
 * 
 * @apiError (Response Error) Channel not idle
 * @apiErrorExample Error-Response: 503
 * {
 *  "code":503,
 *  "error":"Cannot start channel. Wait for Channel to be in IDLE state. Status : RUNNING"
 * }
 * 
 * @apiError (Response Error) Internal Server Error
 * @apiErrorExample Error-Response: 500
 * {
 *  "code" : 500,
 *  "error" : "Internal server error"
 * }
 * 
 */
router.post('/livestream/channel/start/:channel', (req, res) => {
    let channel = req.params.channel;

    util.startChannel(channel)
        .then(result => res.send(result))
        .catch(err => res.send(err));
});

/**
 * @apiDescription API endpoint to stop a channel
 * @api {POST} /livestream/channel/stop/:channel
 * @apiName stopChannel
 * @apiGroup LiveStream
 * @apiParam (URI Param) {String} channel Channel which you need to stop
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * {
 *  "code":202,
 *  "message":"Channel is stopping now. Current state: STOPPING"
 * }
 * 
 * @apiError (Response Error) Channel not found 
 * @apiErrorExample Error-Response: 404
 * {
 *  "code":404,
 *  "error":"Channel not found"
 * }
 * 
 * @apiError (Response Error) Channel not idle
 * @apiErrorExample Error-Response: 503
 * {
 *  "code":503,
 *  "error":"Cannot stop channel. Channel can be stopped only when it is in RUNNING state. Status : RUNNING"
 * }
 * 
 * @apiError (Response Error) Internal Server Error
 * @apiErrorExample Error-Response: 500
 * {
 *  "code" : 500,
 *  "error" : "Internal server error"
 * }
 * 
 */
router.post('/livestream/channel/stop/:channel', (req, res) => {
    let channel = req.params.channel;

    util.stopChannel(channel)
        .then(result => res.send(result))
        .catch(err => res.send(err));
});

/**
 * @apiDescription API endpoint to describe the state for a specific channel
 * @api {GET} /livestream/channel/:channel
 * @apiName describeChannel
 * @apiGroup LiveStream
 * @apiParam (URI Param) {String} channel Channel for which you need to get the state
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * {
 *  "code":200,
 *  "state":"RUNNING"
 * }
 * 
 * @apiError (Response Error) Channel not found 
 * @apiErrorExample Error-Response: 404
 * {
 *  "code":404,
 *  "message":"Channel not found"
 * }
 * 
 * @apiError (Response Error) Internal Server Error
 * @apiErrorExample Error-Response: 500
 * {
 *  "code" : 500,
 *  "error" : "Internal server error"
 * }
 */
router.get('/livestream/channel/:channel', (req, res) => {
    let channel = req.params.channel;

    util.describeChannelByName(channel)
        .then(result => {
            res.send({
                code : 200,
                state: result.State
            })
        })
        .catch(err => res.send(err));
});

/**
 * @apiDescription API endpoint to list the channels
 * @api {GET} /livestream/channels
 * @apiName listChannels
 * @apiGroup LiveStream
 * @apiSuccess {Number} code Success status code
 * @apiSuccess {String} message A verbose status message about the status of the API call
 * @apiSuccessExample Success response: 200
 * {
 *  "code":200,
 *  "channels":[{
 *      "Description":"Desc for channel",
 *      "Id":"id-for-channel"
 *      }]
 *  }
 * 
 * @apiError (Response Error) Channel not found 
 * @apiErrorExample Error-Response: 404
 * {
 *  "code":404,
 *  "message":"Channel not found"
 * }
 * 
 * @apiError (Response Error) Internal Server Error
 * @apiErrorExample Error-Response: 500
 * {
 *  "code" : 500,
 *  "error" : "Internal server error"
 * }
 */
router.get('/livestream/channels', (_req,res) => {
    util.listMediaPackageChannels()
        .then(result => res.send(result))
        .catch(err => res.send(err));
});


module.exports = router;
