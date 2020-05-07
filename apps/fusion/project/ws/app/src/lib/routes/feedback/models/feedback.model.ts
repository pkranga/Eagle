/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IFeedbackRequest {
  application: IFeedbackTypeRequest
  applicationcontent: IFeedbackTypeRequest
  bug: IFeedbackTypeRequest
}

export interface IFeedbackTypeRequest {
  contentId: string | null
  feedbackSubType: string | null
  rating?: string
  feedback: IFeedback[]
  feedbackType: string
}

export interface IFeedback {
  question: string
  meta: string
  answer: string
}
