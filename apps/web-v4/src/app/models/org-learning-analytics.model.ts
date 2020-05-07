/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export interface ServiceObj {
  startDate: string;
  endDate: string;
}

export class PieChartData {
  key: string;
  y: number;
  color: string;
}

export class HorizontalStackedGraphData {
  label: string;
  value: number;
  count: number;
  total: number;
}

export class HorizontalBar {
  label: string;
  value: number;
  color: String;
  count: number;
  total: number;
}

export class HorizontalBarData {
  key: string;
  color: string;
  values: HorizontalBar[];
}
