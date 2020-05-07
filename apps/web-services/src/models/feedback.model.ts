/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IFeedback {
  category?: string
  contentId?: string
  role: string
  rootFeedbackId?: string
  sentiment?: string
  text: string
  type: string
}

export interface IFeedbackSubmit {
  category?: string
  content_id?: string
  rootFeedbackId?: string
  sentiment?: string
  text: string
  type: string
  user_id: string
}

export interface IFeedbackSearchQuery {
  query: string
  filters: { [key: string]: string[] }
  viewedBy: string
  all: boolean
  from: number
  size: number
}

export interface IFeedbackSearch {
  query: string
  filters: { [key: string]: string[] }
  viewed_by: string
  user_id: string
  all: boolean
  from: number
  size: number
}
