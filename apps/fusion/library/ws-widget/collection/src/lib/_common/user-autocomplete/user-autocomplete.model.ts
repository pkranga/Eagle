/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export namespace NsAutoComplete {
  export enum EUserAutoCompleteCategory {
    EMAIL = 'email',
    FIRST_NAME = 'first_name',
    LAST_NAME = 'last_name',
    ROOT_ORG = 'root_org',
    DEPARTMENT_NAME = 'department_name',
  }
  export interface IUserAutoComplete {
    department_name: string
    email: string
    first_name: string
    last_name: string
    root_org: string
    wid: string
  }
}
