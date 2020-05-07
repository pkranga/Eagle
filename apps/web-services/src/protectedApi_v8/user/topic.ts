/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Request, Response, Router } from 'express'
import { IGenericApiResponse } from '../../models/generic.model'
import {
  ITopic,
  ITopicResponse,
  ITopicsApiResponse
} from '../../models/topic.model'
import { CONSTANTS } from '../../utils/env'

const apiEndPoints = {
  autocomplete: `${CONSTANTS.ES_BASE}/lex_topic/_search`,
  recommend: `${CONSTANTS.SB_EXT_API_BASE}/v1/topics/recommended?q=new`,
}
export const topicApi = Router()

topicApi.get('/recommend', async (_req: Request, res: Response) => {
  try {
    const topicResponse: ITopicsApiResponse = await axios
      .get<IGenericApiResponse<ITopicsApiResponse>>(apiEndPoints.recommend)
      .then((response) => response.data.result.response)

    const topics: ITopic[] = topicResponse.topics.map(
      (topicsResponse: ITopicResponse) => ({
        count: topicsResponse.count,
        id: topicsResponse.id,
        name: topicsResponse['concepts.name'],
      })
    )
    res.send(topics)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

topicApi.get('/autocomplete', async (req: Request, res: Response) => {
  try {
    const body = {
      _source: { includes: 'name' },
      suggest: {
        'name-suggest': {
          completion: { field: 'name' },
          prefix: req.query.q,
        },
      },
    }

    const response = await axios.request({
      auth: {
        password: CONSTANTS.ES_PASSWORD,
        username: CONSTANTS.ES_USERNAME,
      },
      data: body,
      method: 'POST',
      url: apiEndPoints.autocomplete,
    })
    res.json(response.data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
