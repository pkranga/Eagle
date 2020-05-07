/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { SafeHtml } from '@angular/platform-browser'

export namespace NSHandsOnModels {

  export interface IProgLanguage {
    id: number
    language: string
    mode: string
  }

  export interface IHandsOnJson {
    title: string
    supportedLanguages: IProgLanguage[]
    problemStatement: string
    starterCodes: string[]
    timeLimit: number
    safeProblemStatement?: SafeHtml
    fpTestCase?: any
    testcases?: any
    forFPCourse?: boolean
  }

}
