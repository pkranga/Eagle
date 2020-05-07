/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Request, Response, Router } from 'express'
import { axiosRequestConfig } from '../configs/request.config'
import { IConceptResult } from '../models/conceptGraph.model'
import { IGenericApiResponse } from '../models/generic.model'
import { CONSTANTS } from '../utils/env'
import { getStringifiedQueryParams } from '../utils/helpers'

const apiEndpoints = {
  autoComplete: `${CONSTANTS.NODE_API_BASE}/post/autocomplete`,
  concept: `${CONSTANTS.SB_EXT_API_BASE}/concepts`,
}

export const conceptGraphApi = Router()

// Get leaderboard
conceptGraphApi.get('/:ids', async (req: Request, res: Response) => {
  try {
    const ids = req.params.ids
    const queryParams = getStringifiedQueryParams({
      ids,
    })
    let url: string
    url = `${apiEndpoints.concept}?${queryParams}`

    const conceptData: IConceptResult[] = await axios
      .get<IGenericApiResponse<IConceptResult[]>>(url, axiosRequestConfig)
      .then((response) => response.data.result.response)

    return res.send(conceptData)
  } catch (err) {
    return res
      .status((err && err.response && err.response.status) || 500)
      .send(err)
  }
})
conceptGraphApi.post('/autocomplete', async (req: Request, res: Response) => {
  try {
    let url: string
    url = `${apiEndpoints.autoComplete}`
    const autoCompleteData: [] = await axios
      .post<[]>(url, req.body, axiosRequestConfig)
      .then((response) => response.data)
    return res.send(autoCompleteData)
  } catch (err) {
    return res
      .status((err && err.response && err.response.status) || 500)
      .send(err)
  }
})
