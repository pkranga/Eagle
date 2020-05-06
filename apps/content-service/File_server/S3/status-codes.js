/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
let errors = {

    InternalServerError: (message) => {
        let response = {
            code: 500,
            error: 'Internal Server Error'
        };

        if (message) response.message = message;

        return response;
    },

    NotFound: (message) => {
        let response = {
            code: 404,
            error: 'Not Found'
        };

        if (message) response.message = message;

        return response;

    },

    BadRequest: (message, params) => {
        let response = {
            code: 400,
            error: 'Bad Request'
        };

        if (message) response.message = message;

        if (params) {
            for (let id in params) {
                response[id] = params[id];
            }
        }

        return response;

    },

    AlreadyExists: (message) => {
        let response = {
            code: 409,
            error: 'Conflict'
        };

        if (message) response.message = message;

        return response;

    },

    Unauthorized: (message) => {
        let response = {
            code: 401,
            error: 'Unauthorized'
        };

        if (message) response.message = message;

        return response;

    },




};

let success = {

    Success: (message, params) => {
        let response = {
            code: 200
        };

        if (message) response.message = message;

        if (params) {
            for (let id in params) {
                response[id] = params[id];
            }
        }

        return response;
    },

    ResourceCreated: (message, params) => {
        let response = {
            code: 201
        };

        if (message) response.message = message;

        if (params) {
            for (let id in params) {
                response[id] = params[id];
            }
        }

        return response;
    },

    ResourceDeleted: (message) => {
        let response = {
            code: 202
        };

        if (message) response.message = message;

        return response;
    },

    MultiStatus: (message, params) => {
        let response = {
            code: 207
        };

        if (message) response.message = message;

        if (params) {
            for (let id in params) {
                response[id] = params[id];
            }
        }

        return response;
    },


}

module.exports = {
    errors,
    success
};
