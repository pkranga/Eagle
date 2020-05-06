/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// const clamav = require('clamav.js');
const log = require('../Logger/log');
const config = require('../ConfigReader/loader');

const avHost = config.getProperty('av_scan_host');
const avPort = config.getProperty('av_scan_port') || 3310;

const NodeClam = require('clamscan');

let clamscan = null;

if (avHost && avPort) {
  (async () => {
    try {
      console.log('Starting the AV Scanner...', clamscan);
      clamscan = await initialiseClamAV();
      console.log('Successfully started the AV Scanner');
    } catch (e) {
      // Deal with the fact the chain failed
      console.error('Could not load the AV server correctly', e);
    }
  })();
}

function initialiseClamAV() {
  return new Promise((resolve, reject) => {
    new NodeClam().init({
      clamdscan: {
        host: avHost,
        port: avPort,
        bypass_test: true,
        // socket: '/var/run/clamd.scan/clamd.sock'
      }
    })
    .then(_clamscan => resolve(_clamscan))
    .catch((ex) => {
      console.error('Exception while trying to initialize clamscan', ex);
      reject(ex);
    });
  });
}

function checkForVirusInStreamCopy(inputStream, outputStream) {
  return new Promise(async (resolve, reject) => {
    if (!avHost || clamscan === null) {
      console.error('Error in the AV configuration');
      return reject({
        error: 'Antivirus is not configured properly'
      });
    }
    log.info('Starting the AV check');

    const av = clamscan.passthrough();
    inputStream.pipe(av).pipe(outputStream);

    let isScanCompleted = false;
    let isOutputSaved = false;

    av.on('error', error => {
      if ('data' in error && error.data.is_infected) {
        console.error("Input stream containes a virus(es):", error.data.viruses);
      } else {
        console.error(error);
      }
      return reject({
        result: 'VIRUS DETECTED',
        virus: error.data.viruses,
      });
    }).on('finish', () => {
      console.log("All data has been sent to virus scanner");
    }).on('end', () => {
      console.log("All data has been scanned sent on to the destination!");
    }).on('scan-complete', result => {
      isScanCompleted = true
      console.log("Scan Complete: Result: ", result);
      if (result.is_infected === true) {
        console.log(`You've downloaded a virus (${result.viruses.join(', ')})! Don't worry, it's only a test one and is not malicious...`);
        return reject({
          result: 'VIRUS DETECTED',
          virus: result.viruses.join(', '),
        });
      } else if (result.is_infected === null) {
        console.log('ISSUE WHILE SCANNING THE FILE');
        return reject({
          result: 'ISSUE WHILE SCANNING THE FILE'
        });
      } else {
        console.log(`Input stream does not contain any kind of virus....Resolving!`);
        if (isOutputSaved) {
          return resolve({
            result: 'OK',
          });
        } else {
          console.log('Output is not finished writing yet...');
        }
      }
    });

    outputStream.on('finish', () => {
      isOutputSaved = true;
      console.log("Data has been fully written to the outputStream...");
      // Sending a response only if the scan was successfull
      if (isScanCompleted) {
        return resolve({
          result: 'OK',
        });
      }
    });

    outputStream.on('error', error => {
      console.log("Final Output Fail: ", error);
      return reject({
        result: 'Error while writing to output stream'
      });
    });
  });
}

function checkVirusInInputStream(inputStream) {
  return new Promise((resolve, reject) => {
    if (!avHost || clamscan === null) {
      console.error('Error in the AV configuration');
      return reject({
        error: 'Antivirus is not configured properly'
      });
    }
    console.log('Starting the AV Scan for stream: ....');
    clamscan.scan_stream(inputStream, (err, result) => {
      if (err) {
        console.error(err);
        return reject({
          error: err,
        });
      }
      console.log(result);

      if (result.is_infected && result.viruses.length > 0) {
        return reject({
          result: 'VIRUS DETECTED',
          virus: result.viruses.join(', '),
        });
      }
      // No error in the stream. File is antivirus free
      resolve({
        result: 'OK',
      });
    });
  });
}

function getClamScan() {
  return clamscan;
}

module.exports = { checkForVirusInStreamCopy, checkVirusInInputStream, getClamScan };
