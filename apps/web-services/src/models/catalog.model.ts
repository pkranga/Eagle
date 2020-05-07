/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface ICatalogItem {
    identifier: string,
    value: string,
    children: string[],
    parent: string[]
}

export interface ICatalogTreeNode {
    identifier: string,
    value: string,
    children: ICatalogTreeNode[],
    path?: string[],
}

export interface IFilterUnitResponse {
    id?: string
    type: string
    displayName: string
    content: IFilterUnitContent[]
}

export interface IFilterUnitContent {
    type?: string
    id?: string
    displayName: string
    count: number
    children?: IFilterUnitContent[]
}
