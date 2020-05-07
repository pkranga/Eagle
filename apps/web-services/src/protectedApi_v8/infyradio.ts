/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Router } from 'express'
import { IContent } from '../models/content.model'
import { CONSTANTS } from '../utils/env'

const API_END_POINTS = {
  infyradio: `${CONSTANTS.ES_BASE}/lexcontentindex/resource/_search`,
}

export const infyRadioApi = Router()

infyRadioApi.get('/', async (req, res) => {
  try {
    let type = req.query.type
    type = type === 'Podcasts' ? 'Archives' : type

    const body = {
      query: {
        bool: {
          must: [
            {
              nested: {
                path: 'tags',
                query: {
                  term: {
                    'tags.value.keyword': {
                      value: type,
                    },
                  },
                },
              },
            },
          ],
        },
      },
    }
    let data = []
    const response = await axios.request({
      auth: {
        password: CONSTANTS.ES_PASSWORD,
        username: CONSTANTS.ES_USERNAME,
      },
      data: body,
      method: 'POST',
      url: API_END_POINTS.infyradio,
    })
    if (response.data && response.data.hits && response.data.hits.hits) {
      data = response.data.hits.hits.map((hit: { _source: IContent }) => {
        return hit._source || {}
      })
    }
    res.json(data)
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
