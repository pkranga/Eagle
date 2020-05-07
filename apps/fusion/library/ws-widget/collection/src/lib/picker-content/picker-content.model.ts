/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export interface IPickerContentData {
  preselected?: Set<string>
  availableFilters?: string[]
  enablePreselected?: boolean
  showChips?: boolean
  chipNamesHash?: { [id: string]: string }
}

export interface IRemoveSubsetResponse {
  resource_list: string[]
  suggested_time: number
  goal_message: string[]
}

export interface ISearchConfig {
  search: {
    languageSearch: string[];
  }
}
