/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IScheduleObj {
  startDate: string
  endDate: string
  location: string
  search: string
}

export interface IRegisterObj {
  courseId: number
}

export interface IDateObj {
  startDate: string
  endDate: string

}

export interface IOfferingData {
  key: string
  value: number
}

export interface IScheduleData {
  courseCode: string
  courseDescription: string
  dtEndDate: string
  dtInsertedES: string
  dtStartDate: string
  intCourseOfferingId: string
  location: string
  offeringMode: string
  offeringOrder: number
  registrationCount: number
  title: string,
  isRegister?: any
}

export interface IScheduleDataResponse {
  hits: IScheduleData[]
  indexedOn: string
  offeringsCount: number
  refiners: [{
    offeringMode: IOfferingData[],
  }]
  total: number
}
