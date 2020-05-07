/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IContent {
  identifier: string
  locale: string
}

export interface IContentUserDetails {
  name: string
  id: string
}

export type TMimeTypes = 'application/pdf' | 'application/html' | 'application/channel'
export type TLearningMode = 'Instructor-Led' | 'Self-Paced'
export type TStatus =
  | 'Draft'
  | 'InReview'
  | 'Reviewed'
  | 'Live'
  | 'QualityReview'
  | 'Processing'
  | 'Deleted'
