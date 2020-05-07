/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface IUserNotification {
  image: string;
  badge_group: string;
  is_new: number;
  received_count: number;
  badge_id: string;
  how_to_earn: string;
  progress: number;
  threshold: number;
  badge_type: string;
  badge_name: string;
  last_received_date: string;
  first_received_date: string;
  hover_text: string;
  message: string;
}

export interface IUserTotalPoints {
  learning_points: number;
  collaborative_points: number;
}

export interface IUserNotifications {
  totalPoints: IUserTotalPoints[];
  recent_badge: IUserNotification;
}

export interface IUserNotificationsApiResponse {
  response: IUserNotifications;
}
