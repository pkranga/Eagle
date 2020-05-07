/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IUserCourseInProgress {
  children: string[];
  contentType: string;
  duration: number;
  identifier: string;
  name: string;
  pending: number;
  progress: string;
  thumbnail: string;
  timeLeft: number;
  timeSpent: number;
  totalDuration: number;
  generated: boolean;
}
export type IUserCourseProgress = IUserCourseInProgress[];
export interface IUserCourseProgressResponse {
  results: IUserCourseInProgress[];
  count: number;
  // for UI only
  totalPages?: number;
}

export interface IUserCourseProgressApiResponse {
  result: IUserCourseProgressResult;
}

export interface IUserCourseProgressResult {
  response: IUserCourseProgressResponse;
}

export interface IUserCourseChildProgressApiResponse {
  result: IUserChildProgressResult;
}

export interface IUserChildProgressResult {
  response: IUserCourseProgress;
}
