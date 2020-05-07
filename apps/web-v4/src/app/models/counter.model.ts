/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface ICounterInfyMeResponse {
  downloads: ICounterInfyMeEntity[];
  yesterdaysDownloads: number;
  totalDownloads: number;
}
export interface ICounterInfyMeEntity {
  date: string;
  count: number;
}
export interface ICounterPlatformResponse {
  load: ICounterPlatformEntity[];
  learners: ICounterPlatformEntity[];
  users: ICounterPlatformEntity[];
}
export interface ICounterPlatformEntity {
  time: number;
  count: number;
}
export interface ICounterPlotData {
  data: ICounterPlatformEntity[];
  meta: ICounterGraphMeta;
}
export interface ICounterInfyMePlotData {
  data: ICounterInfyMeEntity[];
  meta: ICounterGraphMeta;
}
export interface ICounterGraphMeta {
  chartId: string;
  graphLabel: string;
  graphTitle: string;
  graphType: string;
  xLabel: string;
  yLabel: string;
  borderColor: string;
  backgroundColor: string;
  header?: {
    icon: string;
    value: number;
    txt: string;
  };
}
