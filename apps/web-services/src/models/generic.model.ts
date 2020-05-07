/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export type Primitive = string | boolean | number | undefined | null | Symbol

export interface IJSON {
  [index: string]: IJSON | Primitive
}

export interface IGenericApiResponse<T> {
  id: string
  ver: string
  ts: string
  params?: {}
  responseCode: string
  result: IGenericApiResult<T>
}

export interface IGenericApiResult<T> {
  response: T
}
