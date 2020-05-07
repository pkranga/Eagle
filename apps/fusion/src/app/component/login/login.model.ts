/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IWSPublicLoginConfig {
  bodyBackgroundImageUrl: string
  footer: ILoginFooterConfig
  topbar: ILoginTopbarConfig
  isClient: boolean
}

export interface ILoginFooterConfig {
  contactUs: boolean
  copyright: boolean
  faq: boolean
  hasLogo: boolean
  isVisible: boolean
  logoUrl: string
  tnc: boolean
  descriptiveFooter: ILoginDescriptiveFooterConfig
}

export interface ILoginDescriptiveFooterConfig {
  available: boolean
  welcomeMessage: string
  welcomeTagline: string
}

export interface ILoginTopbarConfig {
  about: boolean
  apps: boolean
  hasLogo: boolean
  isVisible: boolean
  logoUrl: string
}
