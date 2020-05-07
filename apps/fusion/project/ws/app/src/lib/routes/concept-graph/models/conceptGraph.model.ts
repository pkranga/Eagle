/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IConceptItem {
  score: number
  synonyms: string | null
  name: string
  id: number
}
export interface IConceptResult {
  related: IConceptItem[]
  synonyms: string | null
  name: string
  id: number
}
export interface IRelationLinks {
  level: string
  source: number
  target: number
  type: string
}
export interface IRelationChild {
  score: number
  synonyms: string | null
  name: string
  id: number
}
export interface IRelationChildren {
  score: number
  synonyms: string | null
  name: string
  id: number
  children?: IRelationChild[]
}
export interface IRelationData {
  children: IRelationChildren[]
  id: number
  isRoot: boolean
  name: string
}
export interface IReturnChild {
  id: number
  name: string
  isRoot: boolean
  level: string
  node: string
  count: number
  index: number
}
export interface IConceptAutoComplete {
  id: string
  name: string
  concept_id: number
}
export interface ILinkedIndex {
  [key: string]: number
}
export interface IGraphData {
  nodes: IReturnChild[]
  links: IRelationLinks[]
}
export interface IGraphDataV2 {
  raw: IRelationData
  nodes: IReturnChild[]
  links: IRelationLinks[]
}
export interface IGraphRootNode {
  name: string
  id: number
  children: IRelationChild[]
}
