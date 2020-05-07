/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IWidgetsPlayerPdfData {
  pdfUrl: string
  resumePage?: number
  identifier: string
  passThroughData?: any
  disableTelemetry?: boolean
  hideControls?: boolean
  readValuesQueryParamsKey?: {
    zoom: string;
    pageNumber: string;
  }
}

export interface IPlayerPdf {
  pdfUrl: string
  resumePage?: number
  identifier?: string
  passThroughData?: any
  disableTelemetry?: boolean
  hideControls?: boolean
  readValuesQueryParamsKey?: {
    zoom: string;
    pageNumber: string;
  }
}
