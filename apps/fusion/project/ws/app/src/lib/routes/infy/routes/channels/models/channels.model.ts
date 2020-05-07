/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IWsChannelsConfig {
  tabs: IWsChannelsTab[]
}

export interface IWsChannelsTab {
  tabDetails: IWsChannelTabDetails
  tabContent: IWsChannelTabContent
}

export interface IWsChannelTabDetails {
  name: string
  key: string
  routerLink: string
}

export interface IWsChannelTabContent {
  cardType: string
  data: IWsChannelLeaderData[] | IWsChannelInitiativesData[] | IWsChannelEventsData[]
}

export interface IWsChannelLeaderData {
  name: string
  designation: string
  profileImage: string
  routerLink: string
}

export interface IWsChannelInitiativesData {
  title: string
  desc: string
  iconName: string
  routerLink: string
}

export interface IWsChannelEventsData {
  eventName: string
  routerLink: string
  startTime?: string
  endTime?: string
}
