/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Request, Response, Router } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { CONSTANTS } from '../../utils/env'

const apiEndPoints = {
  read: `${CONSTANTS.AUTHORING_BACKEND}/action/meta/v1/skills`,
}

export const skillsApi = Router()

skillsApi.post('/autocomplete', async (req: Request, res: Response) => {
  try {
    const rootOrg = req.header('rootOrg')
    const org = req.header('org')
    const langCode = req.header('locale')

    // tslint:disable-next-line: no-console
    console.log(
      // tslint:disable-next-line: max-line-length
      `AUTOCOMPLETE::${apiEndPoints.read}    :: rootOrg:${rootOrg}, org:${org}, langCode:${langCode}`
    )
    const response = await axios.post(`${apiEndPoints.read}`, req.body, {
      ...axiosRequestConfig,
      headers: { rootOrg, org, langCode },
    })
    res.send(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
