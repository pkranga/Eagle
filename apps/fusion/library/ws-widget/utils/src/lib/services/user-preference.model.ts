/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IUserPreference {
  selectedTheme: string
  selectedFont: string
  selectedLocale: string
  isDarkMode: boolean
  isIntranetAllowed?: boolean
  isRTL: boolean
  colorPallet: string[]
  defaultCardType: string
  pinnedApps: string
  selectedLangGroup?: string
}
