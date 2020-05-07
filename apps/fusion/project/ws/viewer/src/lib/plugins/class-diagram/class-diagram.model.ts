/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { SafeHtml } from '@angular/platform-browser'

export namespace NSClassDiagram {

  export interface IClassDiagramResponse {
    problemStatement: string
    timeLimit: number
    options: IOptionsObject
    safeProblemStatement?: SafeHtml
  }

  export interface IOptionsObject {
    classes: IClassStructure[]
    relations: IRelationStructure[]
  }

  interface IClassStructure {
    id?: number   // ui purpose
    name: string
    type: string
    belongsTo: string
    access: string
  }

  interface IRelationStructure {
    source: string
    relation: string
    target: string
  }

  export interface IClassDiagramApiResponse {
    submitResult: IClassDiagramSubmissionResponse
    verifyResult: IClassDiagramVerifyResponse
  }

  interface IClassDiagramSubmissionResponse {
    submitionStatus: boolean
    submissionMessage: string
  }

  interface IClassDiagramVerifyResponse {
    marksPercent: number
    marks: number
    classErrorsSpecification: IClassError[]
    relationErrorsSpeciifcation: IRelationError[]
    message?: string
  }

  interface IClassError {
    className: string
    attributes: string
    methods: string
    accessSpecifier: string
    errorMarks: number
    errorType: string
  }

  interface IRelationError {
    Relations: string
    ErrorMarks: string
    ErrorType: string
  }

}
