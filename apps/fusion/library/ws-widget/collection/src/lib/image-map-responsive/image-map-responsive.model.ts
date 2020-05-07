/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IWidgetImageMap {
  imageHeight: number
  imageWidth: number
  imageSrc: string
  mapName: string
  map: IWidgetMapMeta[]
  externalData?: string
  containerStyle?: { [key: string]: string }
  containerClass?: string
}

export interface IWidgetMapMeta {
  coords: number[]
  alt: string
  title: string
  link: string
  target?: string
}

export interface IWidgetMapCoords {
  x1: number
  y1: number
  x2: number
  y2: number
}

export interface IWidgetScale {
  height: number
  width: number
}
