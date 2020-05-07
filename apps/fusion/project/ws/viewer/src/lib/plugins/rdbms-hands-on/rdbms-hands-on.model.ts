/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export namespace NSRdbmsHandsOn {
  export interface IRdbmsApiResponse {
    data: string
    validationStatus: boolean
    status: IStatusObject
    tellTextMsg: string
  }

  export interface ISubmissionResult {
    message: string
    status: boolean
  }

  export interface IDbStructureResponse {
    tablename: string
    columnname: string
  }

  export interface IDbStructureResponse {
    tablename: string
    columnname: string
  }

  export interface IInitializeDBTable {
    tableData: any[]
    tableName: string
    tableColumns: any[]
  }
  export interface IDropdownDetails {
    dropdownTitle: string
    concept: string
    query: any
    telltext: string
  }

  interface IStatusObject {
    code: number
    message: string
    rowCount: number
    warnings: string
  }
}
