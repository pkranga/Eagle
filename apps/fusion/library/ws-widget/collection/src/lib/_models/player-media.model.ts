/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IWidgetsPlayerMediaData {
  subtitles?: {
    srclang: string;
    label: string;
    url: string;
  }[]
  identifier?: string
  url: string
  autoplay?: boolean
  markers?: string[]
  resumePoint?: number
  passThroughData?: any
  posterImage?: string
  setCookie?: boolean
  disableTelemetry?: boolean
  isVideojs?: boolean
  platform?: any
  mimeType?: any
}
