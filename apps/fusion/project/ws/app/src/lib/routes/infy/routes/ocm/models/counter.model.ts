/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IWsCounterInfyMeResponse {
  downloads: IWsCounterInfyMeEntity[]
  yesterdaysDownloads: number
  totalDownloads: number
}
export interface IWsCounterInfyMeEntity {
  date: string
  count: number
}
export interface IWsCounterPlatformResponse {
  load: IWsCounterPlatformEntity[]
  learners: IWsCounterPlatformEntity[]
  users: IWsCounterPlatformEntity[]
}
export interface IWsCounterPlatformEntity {
  time: number
  count: number
}
export interface IWsCounterPlotData {
  data: IWsCounterPlatformEntity[]
  meta: ICounterGraphMeta
}
export interface IWsCounterInfyMePlotData {
  data: IWsCounterInfyMeEntity[]
  meta: ICounterGraphMeta
}
export interface ICounterGraphMeta {
  chartId: string
  graphLabel: string
  graphTitle: string
  graphType: string
  xLabel: string
  yLabel: string
  borderColor: string
  backgroundColor: string
  header?: {
    icon: string;
    value: number;
    txt: string;
  }
}
