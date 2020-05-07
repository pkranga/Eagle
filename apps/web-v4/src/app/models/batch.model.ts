/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { IContent } from './content.model';

export interface ICohortsBatchCohorts {
  firstname: string;
  thumbnail: string;
  gender: string;
  subject: string[];
  countrycode: string;
  roles: string[];
  last_name: string;
  language: string[];
  userid: string;
  rootorgid: string;
  lastlogintime: string;
  lastname: string;
  phone: string;
  dob: string;
  location: string;
  regorgid: string;
  profilevisibility: {
    email: string;
    phone: string
  };
  first_name: string;
  email: string;
  emailverified: boolean;
  username: string;
  profilesummary: string;
}

export interface ICoursesForYouResponse {
  response: IContent[];
}

export interface ICohortsBatchCohortsApiResponse {
  response: ICohortsBatchCohorts[];
}
