/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Request } from 'express'
import { readJSONData } from '../utils/read-meta-and-json'
import { IContent } from './../../models/content.model'
import { getHierarchy } from './hierarchy'

export async function getHierarchyWithContent(
  id: string,
  req: Request
  // tslint:disable-next-line: no-any
): Promise<{ content: IContent; data: any }> {
  const content = await getHierarchy(id, req)
  const data = await readJSONData(content)
  return { content, data }
}
