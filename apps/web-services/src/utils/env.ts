/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
const env = process.env
const HTTPS_HOST = env.HTTPS_HOST || 'https://10.177.157.30'
export const CONSTANTS = {
  APP_ANALYTICS: env.LA_HOST_PROXY || 'http://10.177.157.29',
  APP_CONFIGURATIONS: env.APP_CONFIGURATIONS || '/app-config',
  APP_LOGS: env.APP_LOGS || '/logs',
  AUTHORING_BACKEND: env.SUNBIRD_BACKEND || 'http://10.177.63.204:3011',
  CASSANDRA_IP: env.CASSANDRA_IP || '10.177.157.30',
  CASSANDRA_PASSWORD: env.CASSANDRA_PASSWORD || '',
  CASSANDRA_USERNAME: env.CASSANDRA_USERNAME || '',
  CONTENT_API_BASE: env.CONTENT_API_BASE || 'http://10.177.157.30:5903',
  CONTENT_STORE_DEVELOPMENT_BASE: 'https://lex-dev.infosysapps.com',
  ES_BASE: env.ES_BASE || 'http://10.177.157.30:9200',
  ES_PASSWORD: env.ES_PASSWORD || 'Infy@123+',
  ES_USERNAME: env.ES_USERNAME || 'elastic',
  HTTPS_HOST,
  IAP_CLIENT_SECRET: env.IAP_CLIENT_SECRET,
  IAP_CODE_API_BASE: env.IAP_CODE_API_BASE || 'https://lex-iap.infosysapps.com',
  IAP_PROFILE_API_BASE: env.IAP_PROFILE_API_BASE || 'https://lex-iap.infosysapps.com',
  ILP_FP_PROXY: env.ILP_FP_PROXY || 'http://10.177.62.155',
  IS_CASSANDRA_AUTH_ENABLED: Boolean(env.CASSANDRA_AUTH_ENABLED),
  IS_DEVELOPMENT: env.NODE_ENV === 'development',
  JAVA_API_BASE: env.JAVA_API_BASE || 'http://10.177.157.30:5825',
  KEYCLOAK_REALM: env.KEYCLOAK_REALM || 'sunbird',
  KHUB_CLIENT_SECRET: env.KHUB_CLIENT_SECRET || 'axc123',
  KHUB_GRAPH_DATA: env.KHUB_GRAPH_DATA || 'http://10.177.157.30:3016',
  KHUB_SEARCH_BASE: env.KHUB_SEARCH_BASE || 'http://10.177.157.30:3014',
  NAVIGATOR_JSON_HOST:
    env.NAVIGATOR_JSON_HOST || 'http://10.177.157.30:3007/web-hosted/navigator/json',
  NODE_API_BASE: env.NODE_API_BASE || 'http://10.177.157.30:5001',
  NODE_API_BASE_2: env.NODE_API_BASE_2 || 'http://10.177.157.30:3009',
  NODE_API_BASE_2_CLIENT_ID: env.NODE_API_BASE_2_CLIENT_ID || 'admin',
  NODE_API_BASE_2_CLIENT_SECRET: env.NODE_API_BASE_2_CLIENT_SECRET || 'MdiDn@342$',
  NODE_API_BASE_3: env.NODE_API_BASE_3 || 'http://10.177.157.30:3015',
  NOTIFICATIONS_API_BASE: env.NOTIFICATIONS_API_BASE || 'http://10.177.22.26:5805',

  PID_API_BASE: env.PID_API_BASE || 'http://10.177.22.26:9200',
  // tslint:disable-next-line:ban
  PORTAL_PORT: parseInt(env.PORTAL_PORT + '', 10) || 3003,
  RESET_PASSWORD: 'http://siemens-staging.onwingspan.com',
  SB_EXT_API_BASE: env.SBEXT_API_BASE || 'http://10.177.22.26:5902',
  SB_EXT_API_BASE_2: env.SBEXT_API_BASE_2 || 'http://10.177.157.30:7001',
  SB_EXT_API_BASE_3: env.SBEXT_API_BASE_2 || 'http://10.177.61.54:7001',
  SCORM_PLAYER_BASE: env.SCORM_PLAYER_BASE || 'http://10.177.61.57',
  STATIC_ILP_PROXY: env.STATIC_ILP_PROXY || 'http://10.177.157.30:3005',
  TELEMETRY_API_BASE: env.TELEMETRY_API_BASE || 'http://10.177.157.30:8090',
  TELEMETRY_SB_BASE: env.TELEMETRY_SB_BASE || 'http://10.177.63.199:9090',
  TIMEOUT: env.TIMEOUT || 10000,
  USER_ANALYTICS: `${HTTPS_HOST}/LA1`,
  USE_SERVING_HOST_COUNTER: env.USE_SERVING_HOST_COUNTER,
  VIEWER_PLUGIN_RDBMS_API_BASE:
    process.env.VIEWER_PLUGIN_RDBMS_API_BASE || 'http://10.177.61.54:5801',
  WEB_HOST_PROXY: env.WEB_HOST_PROXY || 'http://10.177.157.30:3007',
}
