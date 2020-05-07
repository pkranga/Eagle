/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface ITopicsApiResponse {
  topics: ITopicResponse[]
}

export interface ITopicResponse {
  'concepts.name': string
  count: number
  id: string
}

export interface ITopic {
  name: string
  count: number
  id: string
}

export interface IInterestApiResponse {
  rootOrg: string
  org: string
  language: string
  interestId: string
  interest: string
}
