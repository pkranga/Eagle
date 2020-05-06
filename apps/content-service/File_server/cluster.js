/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/**
 * Setting up the cluster to the master and node, depending on the number of processor.
 */
const cluster = require('cluster');
// Getting the number of cpus available where the server is running
const numCPUs = require('os').cpus().length;

const log = require('./Logger/log');

// const listener = require('./MetaListener/listener');
// const metaLoader = require('./Meta/loadMetaFromES');
const pidFileName = 'process-ids.txt';
const fs = require('fs-extra');

if (fs.existsSync('./process-ids.txt')) {
  fs.removeSync('./process-ids.txt');
}
fs.ensureFileSync('./process-ids.txt');

// Starting the stats counter, if stats is enabled
const config = require('./ConfigReader/loader');
const statsUtil = require('./stats/statsUtil');

checkCounter();

function checkCounter() {
  try {
    if (config.getProperty('stats') && parseInt(config.getProperty('stats')) === 1) {
      log.info('Started the counter');
      const timeInterval = 3 * 60 * 1000; // 3 Minutes
      setInterval(saveCounterData, timeInterval);
    }
  } catch (e) {
    console.error('Exception while trying to start the counter', 'Ignoring it!');
  }
}

function saveCounterData() {
  log.info('\n\n\n\-------------- Calling the counter now ---------------\n\n\n');
  statsUtil.saveData(0);
}

// fs.readFile('./process-ids.txt'), { encoding: 'utf-8' }, (err, data) => {console.log('Data is: ' + data.toString())};
// If the cluster is a master node, start the cluster with workers on the
if (process.argv[2] === 'start') {
  if (cluster.isMaster) {
    log.info('\n\nMaster ' + process.pid + ' is running\n\n');
    // This will come in soon after the content meta ports to the mongodb instead of elasticsearch
    // listener.startChangeListener();
    // metaLoader.startLoadAction();

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
      // Starting the workers
      cluster.fork();
    }
    // cluster.fork();
    cluster.on('exit', (worker, code, signal) => {
      console.error(
        '***********************\nWorker ' +
          worker.process.pid +
          ' died\n***********************'
      ); //eslint-disable-line
      log.info('Signal is:', signal);
      // Starting a new worker
      cluster.fork();
    });
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    // Getting the server
    require('./app');
    log.info('Worker ' + process.pid + ' started');
    let textToWrite = process.pid + ',';
    setTimeout(() => fs.appendFile(`./${pidFileName}`, textToWrite), 1000);
  }
}
