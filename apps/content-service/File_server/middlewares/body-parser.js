/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// Body parser for reading the JSON body of a request
const bodyParser = require('body-parser');

function addBodyParser(app) {
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: 500 * 1024 // 500 kb
    })
  );
  app.use(
    bodyParser.json({
      limit: '250mb'
    })
  );
}

module.exports = {
  addBodyParser,
}
