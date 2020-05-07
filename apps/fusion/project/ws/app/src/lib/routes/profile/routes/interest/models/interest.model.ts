/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface ITopic {
  id: string
  date_created: string
  date_modified: string
  name: string
  source: string
  source_id: 0
  source_source: string
  source_status: string
  status: string
}

export interface ITopicRecommended {
  id: string
  name: string
  count: number
}

// export interface IInterestUserResponse {
//   rootOrg: string
//   org: string
//   language: string
//   interestId: string
//   interest: string
// }
