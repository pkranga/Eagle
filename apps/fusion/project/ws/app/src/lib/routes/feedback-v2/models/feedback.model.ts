/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IFeedbackSearchRequest {
  query?: string
  filters?: { [key: string]: string[] }
  author: boolean
}

export interface IFeedback {
  category?: string
  contentId?: string
  rootFeedbackId?: string
  sentiment?: 'positive' | 'negative'
  text: string
  type: EFeedbackType
}

export enum EFeedbackType {
  Content = 'content_feedback',
  Platform = 'platform_feedback',
  ContentRequest = 'content_request',
  ServiceRequest = 'service_request',
}
