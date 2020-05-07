/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'
import { ERROR } from '../../utils/message'

const API_END_POINTS = {
  users: (rootOrg: string, searchItem: string) =>
    `${CONSTANTS.PID_API_BASE}/user/autocomplete/${rootOrg}/all/${searchItem}`,
}

export const autocompleteApi = Router()

autocompleteApi.get('/:query', async (req, res) => {
  const org = req.header('org')
  const rootOrg = req.header('rootOrg')
  if (!org || !rootOrg) {
    res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
    return
  }
  const url = API_END_POINTS.users(rootOrg, req.params.query)
  try {
    const response = await axios({
      ...axiosRequestConfig,
      headers: { rootOrg },
      method: 'GET',
      url,
    })
    res.send(response.data)
  } catch (err) {
    return err
  }
})
