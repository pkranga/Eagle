/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsWidgetResolver } from '@ws-widget/resolver'

export namespace NsGalleryView {
  export interface IWidgetGalleryView {
    designVal?: string
    autoNext?: boolean
    delay?: number
    loop?: boolean
    type?: string
    subType?: string
    cardMenu: ICardMenu[]
    configs: ICardConfig
  }
  export interface ICardMenu {
    cardData?: ICardData
    widget: NsWidgetResolver.IRenderConfigWithAnyData
  }

  interface ICardConfig {
    widgetPlayer: IStyleConfig
    widgetRibbon: IStyleConfig
  }

  interface IStyleConfig {
    className: string
    styles: { [key: string]: string }
  }

  interface ICardData {
    title: string
    description: string
    thumbnail: string
    // UI only
    currentlyPlaying?: boolean
  }
}
