/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IAuthoringPagination {
  offset: number,
  limit: number
}

export interface IMenuNode {
  name: string
  children?: IMenuNode[]
  icon?: string
  status?: string
}

export interface IMenuFlatNode {
  expandable: boolean
  name: string
  levels: number
}

export interface IFilterMenuNode {
  displayName: string
  content?: IFilterMenuNode[]
  type?: string
  checked?: boolean
  count?: number
}

export interface IFilterOptions {
  contentType: string[]
  resourceType: string[]
}

export interface IFilterObject {
  status: string[]
  contentType: string[]
  complexityLevel: string[]
  sourceName: string[]
}
