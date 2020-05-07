/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
export namespace NsTnc {
  export interface ITnc {
    isAccepted: boolean
    isNewUser?: boolean
    termsAndConditions: ITncUnit[]
  }
  export interface ITncUnit {
    acceptedDate: Date
    acceptedLanguage: string
    acceptedVersion: string
    availableLanguages: string[]
    content: string
    isAccepted: boolean
    language: string
    name: 'Generic T&C' | 'Data Privacy'
    version: string
  }
  export interface ITncAcceptRequest {
    termsAccepted: ITermAccepted[]
  }
  export interface ITermAccepted {
    acceptedLanguage: string
    docName: string
    version: string
  }
}
