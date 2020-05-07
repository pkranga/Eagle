/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/

export interface ILeaderboardApiResponse {
  response: ILeaderboardToppers;
}
export interface ILeaderboardToppers {
  result: ILeaderboardTopper;
  duration_value: number;
  lastUpdatedDate: string;
  tabType?: 'WEEKLY' | 'MONTHLY' | 'HALL_OF_FAME';
}
export interface ILeaderboardTopper {
  duration_type: string;
  duration_value: number;
  start_date: Date;
  end_date: Date;
  lastUpdatedDate: string;
  items: ILeaderboardTopperDetails[];
  leaderboard_type: string;
  leaderboard_year: number;
  prev: ILeaderboardPrevNext;
  next: ILeaderboardPrevNext;
}
export interface ILeaderboardTopperDetails {
  designation: string;
  email_id: string;
  first_name: string;
  last_name: string;
  percentile: number;
  points: number;
  rank: number;
  unit: string;
  user_id: string;
  leaderboard_type: string;
  leaderboard_year: number;
}
export interface ILeaderboardPrevNext {
  leaderboard_year: number;
  duration_value: number;

}

export interface ILeaderBoardItems {
  designation: string;
  duration_type: string;
  duration_value: number;
  email_id: string;
  first_name: string;
  last_name: string;
  leaderboard_type: string;
  leaderboard_year: number;
  points: number;
  rank: number;
  unit: string;
}

export interface ILeaderBoard {
  duration_type: 'W' | 'M';
  duration_value: number;
  end_date: string;
  items: ILeaderBoardItems[];
  lastUpdatedDate: string;
  leaderboard_type: 'L' | 'C';
  leaderboard_year: number;
  prev: { leaderboard_year: number; duration_value: number };
  start_date: string;
}
