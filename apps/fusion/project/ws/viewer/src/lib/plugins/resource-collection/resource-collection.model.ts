/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IUserFetchMySubmissionsResponse {
  submission_url: string
  testcases_failed: number
  total_testcases: number
  feedback_time: string
  feedback_by: string
  submission_id: string
  feedback_url: string
  submission_type: string
  submission_time: string
  testcases_passed: number
  result_percent: number
  feedback_type: string
  currentRowNumber?: number
}
