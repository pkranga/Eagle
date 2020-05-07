/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export class TodoItemNode {
  children!: TodoItemNode[]
  name!: string
}

export interface ITodoItemFlatNode {
  name: string
  level: number
  expandable: boolean
  identifier: string
  nodeId: string
  path: string
  checkable: boolean
}

export interface ICatalog {
  identifier: string
  name: string
  isFromPref: boolean
  nodeId: string
  path: string
  level: number
  child: ICatalog[]
}
