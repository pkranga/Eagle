/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NSContent } from './content'

export type IValueType = 'boolean' | 'array' | 'string' | 'number' | 'object'
export type ICondition = {
  [key in keyof NSContent.IContentMeta]: any[]
}

export type IFormMeta = {
  [key in keyof NSContent.IContentMeta]: {
    showFor: {
      [value in NSContent.IContentType]: ICondition[]
    },
    notShowFor: {
      [value in NSContent.IContentType]: ICondition[]
    },
    notMandatoryFor: {
      [value in NSContent.IContentType]: ICondition[]
    },
    mandatoryFor: {
      [value in NSContent.IContentType]: ICondition[]
    },
    disabledFor: {
      [value in NSContent.IContentType]: ICondition[]
    },
    notDisabledFor: {
      [value in NSContent.IContentType]: ICondition[]
    },
    defaultValue: {
      [value in NSContent.IContentType]: {
        condition: ICondition,
        value: any,
      }[]
    },
    type: IValueType,
  }
}
