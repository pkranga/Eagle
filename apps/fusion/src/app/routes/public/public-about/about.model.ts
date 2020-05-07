/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IBanner {
  title: string
  description: string
  videoLink: string
  moreInfo: string
}

export interface ISection1 {
  title: string
  leftParas: string[]
  rightParas: string[]
}

export interface ISection2 {
  description?: string
}

export interface ISection3 {
  title: string
  videoUrl: string
  rightParas: string[]
}

export interface ICard {
  icon: string
  title: string
  para: string[]
}

export interface ISection4 {
  title: string
  subTitle?: string
  cards: ICard[]
}

export interface ISection5 {
  title: string
  subtitle: string
  para: string
}

export interface IFeatures {
  title?: string
  description?: string
  list?: { [key: string]: string }
}

export interface IAboutObject {
  banner: IBanner
  section1: ISection1
  section2?: ISection2
  section3?: ISection3
  section4: ISection4
  section5: ISection5
  features?: IFeatures
}
