/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Router } from 'express'
import { IFilterUnitContent } from '../models/catalog.model'
import { getFilters, getFilterUnitByType } from '../service/catalog'
import { ERROR } from '../utils/message'
import { extractUserIdFromRequest } from '../utils/requestExtract'

export const catalogApi = Router()

catalogApi.get('/', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const rootOrg = req.headers.rootorg
    const locale = req.header('locale') || ''
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    if (typeof rootOrg === 'string') {
      const filters = await getFilters(userId, rootOrg, 'catalogPaths', [locale])
      res.send(filters)
      return
    }

    res.status(400).send({ error: ERROR.ERROR_NO_ORG_DATA })
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})

catalogApi.post('/tags', async (req, res) => {
  try {
    const userId = extractUserIdFromRequest(req)
    const rootOrg = req.headers.rootorg
    const locale = req.header('locale') || ''
    if (!rootOrg) {
      res.status(400).send(ERROR.ERROR_NO_ORG_DATA)
      return
    }
    const { tags, type } = req.body
    if (typeof rootOrg === 'string') {
      const filterContents: IFilterUnitContent[] = await getFilters(userId, rootOrg, 'catalogPaths', [locale])
      const filterContent = filterContents.find((content) => content.type === type)
      const catalog: IFilterUnitContent | null = getFilterUnitByType(filterContent, tags)
      if (catalog) {
        res.send(catalog.children)
        return
      }

      res.status(400).send({ error: ERROR.ERROR_NO_ORG_DATA })
    }
  } catch (err) {
    res.status((err && err.response && err.response.status) || 500).send(err)
  }
})
