/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { axiosRequestConfig } from './../../../configs/request.config'
import { CONSTANTS } from './../../../utils/env'

export async function readFromS3(url: string): Promise<{}> {
  url = url
    .split('/')
    .slice(4)
    .join('%2F')
  const result = await axios.get(
    `${CONSTANTS.CONTENT_API_BASE}/contentv3/download/${url}`,
    axiosRequestConfig
  )
  try {
    return JSON.parse(result.data)
  } catch {
    return result.data
  }
}
