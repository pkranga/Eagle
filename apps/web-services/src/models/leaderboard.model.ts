/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface ILeaderboard {
  start_date: string
  end_date: string
  lastUpdatedDate: string
  leaderboard_type: string
  leaderboard_year: number
  duration_type: string
  duration_value: number
  prev?: ILeaderboardPrevNext
  next?: ILeaderboardPrevNext
  items: ILeaderboardItem[]
}

export interface ILeaderboardPrevNext {
  leaderboard_year: number
  duration_value: number
}

export interface ILeaderboardItem {
  first_name: string
  last_name: string
  email_id: string
  designation: string
  points: number
  rank: number
  percentile: number
}

export interface IHallOfFameItem {
  first_name: string
  last_name: string
  email_id: string
  designation: string
  rank: number
  points: number
  leaderboard_type: string
  leaderboard_year: number
  duration_type: string
  duration_value: number
}
