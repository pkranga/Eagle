/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import axios from 'axios'
import { Request } from 'express'
import { axiosRequestConfig } from '../../configs/request.config'
import { extractOrgRootOrgAsQuery } from '../utils/org-rootOrg-query'
import { IContent } from './../../models/content.model'
import { CONSTANTS } from './../../utils/env'

const hierarchyApi = '/action/content/hierarchy/'

export async function getHierarchy(id: string, req: Request): Promise<IContent> {
  const data = await axios.get(
    `${CONSTANTS.AUTHORING_BACKEND}${hierarchyApi}${id}${extractOrgRootOrgAsQuery(req)}`,
    axiosRequestConfig
  )
  return data.data as IContent
}
