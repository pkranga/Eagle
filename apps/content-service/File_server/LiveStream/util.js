/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const proxy = require('proxy-agent');
const AWS = require('aws-sdk');
const log = require('../Logger/log');
const fs = require('fs');
const path = require('path');
const util = require('util');

const appConfig = require('../ConfigReader/loader');

let mediaPackage = null;
let mediaLive = null;

// Create medialive channel name-id hash
let mediaLiveChannels = {};
let mediaLiveHashCreated = false;

if (appConfig.getProperty('enable_aws') == '1') {

	// Setting up config for aws-sdk
	AWS.config = new AWS.Config({
		accessKeyId: appConfig.getProperty('AWS_ACCESS_KEY'),
		secretAccessKey: appConfig.getProperty('AWS_SECRET_KEY'),
		region: 'ap-south-1'
	});

	// Set proxy if running on my pc
	if (appConfig.getProperty('MY_PC')) {
		AWS.config.update({
			httpOptions: {
				agent: proxy(process.env['http-proxy'])
			}
		});
	}

	mediaPackage = new AWS.MediaPackage();
	mediaLive = new AWS.MediaLive();
	// Will run when the server starts and create a hash.
	// This will improve performance
	createMediaLiveHash();

	// Create mediapackage channel name-id hash
	// Not implemented because not yet required
}
// Cloudfront endpoints for each channel
const CFEndpoints = {
	'channel-A':
		'linkA',
	'channel-B':
		'linkB',
	'channel-C':
		'linkC',
	'channel-D':
		'linkD',
	'channel-E':
		'linkE'
};


let errorPromise = err => new Promise((_resolve, reject) => reject(err));
let resultPromise = result => new Promise((resolve) => resolve(result));

// Promisify medialive.listChannels()
function listChannels(params) {
	return mediaLive.listChannels(params).promise();
}

fs.writeFile = util.promisify(fs.writeFile);

async function createMediaLiveHash() {
	try {
		let data = await listChannels({
			MaxResults: 20
		});

		let channels = data.Channels;
		channels.forEach(channel => {
			mediaLiveChannels[channel.Name] = channel.Id;
		});

		await fs.writeFile(
			path.join(__dirname, 'channels.json'),
			JSON.stringify(mediaLiveChannels),
			'utf8');

		mediaLiveChannels = require('./channels.json');
		mediaLiveHashCreated = true;
		log.info('Medialive hash created successfully');
	}
	catch (err) {
		log.error('Error occurred while creating aws medialive hash');
		log.error(err);
	}
	return mediaLiveChannels;
}

// Promisify listInputs function from medialive
let listMediaLiveInputs = () => {
	return new Promise((resolve, reject) => {
		let params = {
			MaxResults: 20
		};
		mediaLive.listInputs(params, function (err, data) {
			if (err) reject(err);
			// an error occurred
			else resolve(data);
		});
	});
};

// Get the RTMP URL from medialive
let getRTMPURL = async name => {
	try {
		// Append -input to channel name
		let input = name + '-input';

		// List out medialive inputs
		let data = await listMediaLiveInputs();
		let inputs = data.Inputs;

		// Filter out the required input from the list
		let requiredInput = inputs.filter(inp => inp.Name === input);

		// if the array is empty
		if (requiredInput.length == 0) {
			log.warn('No medialive input with name:' + name);
			return errorPromise({
				code: 404,
				error: 'No medialive input with name:  ' + name
			});
		}
		// else return the rtmp url
		else {
			log.info('Retrieved rtmp url for ' + input);
			return resultPromise({
				code: 200,
				Urls: requiredInput[0].Destinations.map(
					destination => destination.Url
				)
			});
		}
	} catch (err) {
		log.error(err);
		return errorPromise(err);
	}
};

// Get the cloudfront URL for the channel
let getEndpointURL = name => {
	// Read from hashtable defined above and return value
	if (!CFEndpoints[name]) {
		log.warn('No channel with name: ' + name);
		return {
			code: 404,
			message: 'URL for this channel could not be found'
		};
	} else {
		log.info('Retrieved cloudfront url for channel ' + name);
		return {
			code: 200,
			url: CFEndpoints[name]
		};
	}
};

// Promisify medialive.listChannels
/*let listMediaLiveChannels = () => {
	return new Promise((resolve, reject) => {
		let params = {
			MaxResults: 20
		};
		mediaLive.listChannels(params, (err, data) => {
			if (err) {
				log.error(
					'Some error occurred while listing mediaLive channels'
				);
				log.error(err);
				reject({
					code: 500,
					error: 'Internal Server Error'
				});
			} else {
				if (data.Channels.length == 0) {
					log.warn('No channels found');
					reject({
						code: 404,
						error: 'No channels found'
					});
				} else {
					resolve(data);
				}
			}
		});
	});
};*/

// Promisify medialive.describeChannel
let describeChannel = channelId => {
	return new Promise((resolve, reject) => {
		let params = {
			ChannelId: channelId
		};
		mediaLive.describeChannel(params, (err, data) => {
			if (err) {
				log.error(
					'Some error occurred while describing mediaLive channel: ' +
					channelId
				);
				log.error(err);
				reject({
					code: 500,
					error: 'Internal Server Error'
				});
			} else resolve(data);
		});
	});
};

// Describe channel by it's name
let describeChannelByName = async name => {
	if (!mediaLiveHashCreated) {
		log.error(
			'The createMediaLiveHash() function hasn\'t finished executing.'
		);
		log.error('Try again!');
		return errorPromise({
			code: 500,
			error: 'Internal server error'
		});
	}
	try {
		if (!mediaLiveChannels) {
			mediaLiveChannels = require('./channels.json');
		}
		if (!mediaLiveChannels[name]) {
			log.warn('Channel not found : ' + name);
			return errorPromise({
				code: 404,
				error: 'Channel not found'
			});
		} else {
			// Get the medialiveChannel id from the hash and use it to describe the channel
			let channelId = mediaLiveChannels[name];

			let data = await describeChannel(channelId);
			return resultPromise(data);
		}
	} catch (err) {
		log.error(err);
		return errorPromise(err);
	}
};

// Promisify medialive.startChannel
let startMediaLiveChannel = channelId => {
	return new Promise((resolve, reject) => {
		let params = {
			ChannelId: channelId
		};
		mediaLive.startChannel(params, (err, data) => {
			if (err) {
				log.error(
					'Error while starting the medialive channel with channelId: ' +
					err
				);
				log.error(err);
				reject({
					code: 500,
					message: 'Internal server error'
				});
			} else {
				resolve(data);
			}
		});
	});
};

// Promisify medialive.updateChannel
let updateChannel = params => {
	return new Promise((resolve, reject) => {
		mediaLive.updateChannel(params, (err, data) => {
			if (err) {
				log.error(
					'Failed to update medialive channel with mediaStore Endpoint'
				);
				log.error(err);
				reject({
					code: 500,
					message: 'Internal server error'
				});
			} else resolve(data);
		});
	});
};

// Update the medialive channel
let updateChannelAsync = async data => {
	// Every time the channel is started, the mediastore url needs to be updated so that
	// the previous stream stored in mediastore is not overwritten.
	// This is done by removing the old and writing the current timestamp to the URL

	// Get time stamp and remove : and . from the string
	let timeStamp = new Date().toISOString();
	let tArr = timeStamp.split('');
	for (let i = 0; i < tArr.length; i++) {
		if (tArr[i] === ':' || tArr[i] === '.') {
			tArr[i] = '-';
		}
	}
	timeStamp = tArr.join('');

	// Check if mediastore destination is assigned to this channel
	if (
		!data.Destinations ||
		data.Destinations.length < 2 ||
		data.Destinations[1].Settings.length == 0
	) {
		log.error(
			'No mediapackage endpoint found on this channel. ChannelId: ' +
			data.Id
		);
		return errorPromise({
			code: 500,
			message: 'Internal server error'
		});
	}

	// Get the first url and call split
	let url1 = data.Destinations[1].Settings[0].Url.split('/');
	// Overwrite the second last element which is the folder name
	url1[url1.length - 2] = 'pipelineA' + timeStamp;
	// Call join to create the URL
	url1 = url1.join('/');

	// Repeat with second URL
	let url2 = data.Destinations[1].Settings[1].Url.split('/');
	url2[url2.length - 2] = 'pipelineB' + timeStamp;
	url2 = url2.join('/');

	// Assign url to config
	data.Destinations[1].Settings[0].Url = url1;
	data.Destinations[1].Settings[1].Url = url2;

	// Update the channel
	let params = {
		Destinations: data.Destinations,
		ChannelId: data.Id
	};
	try {
		await updateChannel(params);
	} catch (err) {
		log.error(
			'Error occurred while updating the media store endpoint on the channel'
		);
		log.error(err);
		return errorPromise({
			code: 500,
			message: 'Internal server error'
		});
	}
};

// Start the medialive channel
let startChannel = async name => {
	try {
		// Get channel data
		let data = await describeChannelByName(name);
		let channelId = data.Id;
		let state = data.State;

		// Check the state of the channel
		if (state !== 'IDLE') {
			log.warn(
				'Cannot start channel. Wait for Channel to be in IDLE state.Status : ' +
				state
			);
			return errorPromise({
				code: 503,
				error:
					'Cannot start channel. Wait for Channel to be in IDLE state. Status : ' +
					state
			});
		} else {
			// Update the mediastore endpoints
			await updateChannelAsync(data);

			// Start the channel
			await startMediaLiveChannel(channelId);

			log.info('Starting channel : ' + name);
			return resultPromise({
				code: 202,
				message: 'Channel is starting now. Current state: STARTING'
			});
		}
	} catch (err) {
		log.error(err);
		return errorPromise(err);
	}
};

// Promisify medialive.stopChannel
let stopMediaLiveChannel = channelId => {
	return new Promise((resolve, reject) => {
		let params = {
			ChannelId: channelId
		};
		mediaLive.stopChannel(params, (err, data) => {
			if (err) {
				log.error(
					'Error occurred while stopping medialive channel with channelId: ' +
					channelId
				);
				log.error(err);
				reject(err);
			} else {
				resolve(data);
			}
		});
	});
};

// Stop the medialive channel
let stopChannel = async name => {
	try {
		// Get channel data
		let data = await describeChannelByName(name);
		let state = data.State;
		let channelId = data.Id;

		// If the status is RUNNING stop the channel
		if (state !== 'RUNNING') {
			log.error(
				'Cannot stop channel. Channel can be stopped only when it is in RUNNING state. Status : ' +
				state
			);
			return errorPromise({
				code: 503,
				error:
					'Cannot stop channel. Channel can be stopped only when it is in RUNNING state. Status : ' +
					state
			});
		} else {
			await stopMediaLiveChannel(channelId);
			log.info('Stopping channel : ' + name);
			return resultPromise({
				code: 202,
				message: 'Channel is stopping now. Current state: STOPPING'
			});
		}
	} catch (err) {
		log.error(err);
		return errorPromise({
			code: 500,
			error: 'Internal server error'
		});
	}
};

// Promisify mediaPackage.listChannels
let listMediaPackageChannels = () => {
	return new Promise((resolve, reject) => {
		let params = {
			MaxResults: 10
		};
		mediaPackage.listChannels(params, (err, data) => {
			if (err) {
				log.error(
					'Error occurred while listing channels in mediapackage'
				);
				log.error(err);
				reject({
					code: 500,
					message: 'Internal server error'
				});
			} else {
				let channels = data.Channels;

				let result = channels.map(channel => {
					return {
						Description: channel.Description,
						Id: channel.Id
					};
				});
				log.info('Listing channels in mediapackage');
				resolve({
					code: 200,
					channels: result
				});
			}
		});
	});
};

module.exports = {
	getRTMPURL,
	getEndpointURL,
	startChannel,
	stopChannel,
	describeChannel,
	describeChannelByName,
	listMediaPackageChannels
};
