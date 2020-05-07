/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export namespace NSCompetency {
  export interface IAchievementsRes {
    achievements: ICompetency[] | undefined
    assessments?: ICompetency[]
    certifications?: ICompetency[]
    avgCountOrgWide: number
    total: number
    userCountVsOrgWide: number
  }

  export interface ICompetency {
    date: Date
    score: number
    attempts: IAttempts[]
    id: string
    isPassed: boolean
    maxScore: number
    minScore: number
    noOfAttempts: number
    percentile: number
    title: string
    scoreDistribution: IRange
  }

  export interface IRange {
    [key: string]: {
      '0.0-25.0': number;
      '25.0-50.0': number;
      '50.0-75.0': number;
      '75.0-100.0': number;
    }
  }

  export interface IAttempts {
    assessmentDate: Date
    assessmentScore: number
    isPassed: boolean
  }
}
