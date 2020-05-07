/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { TContentType } from './content.model'

export interface ILearningHistory {
  count: number
  error?: string
  results: ILearningHistoryItem[]
}

export interface ILearningHistoryItem {
  children: string[]
  contentType?: TContentType
  displayContentType?: string
  identifier?: string
  last_ts?: number
  name?: string
  pending?: number
  progress?: number
  thumbnail?: string
  timeLeft?: number
  totalDuration?: number
}
