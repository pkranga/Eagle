/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AxiosRequestConfig } from '../models/axios-request-config.model'
import { CONSTANTS } from '../utils/env'

export const axiosRequestConfig: AxiosRequestConfig = {
  retry: 3,
  retryDelay: 1,
  timeout: Number(CONSTANTS.TIMEOUT) || 10000,
}
