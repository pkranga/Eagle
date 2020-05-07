/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export class constants {
  // api
  // static ROOT_URL = `http://localhost:5902/api/`;
  // static ROOT_URL = `http://kmserver11:5902/api/`;
  static ROOT_URL = `/LA1/api/`;
  // static ROOT_URL = `https://siemens.onwingspan.com/LA1/api/`;
  // // static ROOT_URL = `https://lex-dev.infosysapps.com/LA1/api/`;
  // static ROOT_URL = `https://lex-staging.infosysapps.com/LA1/api/`;
  static LOCAL_STORAGE_EMAIL_ID = 'email_id';

  // project endorsement
  // api calls
  static PROJECT_ENDORSEMENT = `projectEndorsement/`;
  static ADD_PROJECT_ENDORSEMENT = `${constants.ROOT_URL}${constants.PROJECT_ENDORSEMENT}add`;
  static GET_PROJECT_ENDORSEMENT_REQUEST_LIST = `${constants.ROOT_URL}${constants.PROJECT_ENDORSEMENT}getList`;
  static GET_PROJECT_ENDORSEMENT_REQUEST = `${constants.ROOT_URL}${constants.PROJECT_ENDORSEMENT}get`;
  static ENDORSE_REQUEST = `${constants.ROOT_URL}${constants.PROJECT_ENDORSEMENT}endorseRequest`;
  // helper
  static CREATE_PROJECT_ENDORSEMENT_FIELDS = ['skill', 'project_code', 'manager_email_id', 'description'];

  // autocomplete apis
  static SEARCH = `${constants.ROOT_URL}search`;
}
