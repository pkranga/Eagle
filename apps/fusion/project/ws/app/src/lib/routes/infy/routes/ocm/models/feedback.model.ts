/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IWsFeedbackRequest {
  application: IWsFeedbackTypeRequest
  applicationcontent: IWsFeedbackTypeRequest
  bug: IWsFeedbackTypeRequest
}

export interface IWsFeedbackTypeRequest {
  contentId: string | null
  feedbackSubType: string | null
  rating?: string
  feedback: IWsFeedback[]
  feedbackType: string
}

export interface IWsFeedback {
  question: string
  meta: string
  answer: string
}
