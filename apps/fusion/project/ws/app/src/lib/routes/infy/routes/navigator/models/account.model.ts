/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IIndustries {
  [industry: string]: {
    [account: string]: IAccount;
  }
}

export interface IAccount {
  [subAccounts: string]: ISubAccount
}

export interface ISubAccount {
  [pillar: string]: IPillar
}

export interface IPillar {
  [subPillar: string]: ISubPillar
}
export interface ISubPillar {
  themeName: string
  overview: IPillarSection[]
  gtm: IPillarSection[]
  tech: IPillarSection[]
}
export interface IPillarSection {
  identifier: string
  lpId: string
  title: string
  description: string
  thumbnail: string
  url: string
}
