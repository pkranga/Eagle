/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NSContent } from './content'
import { IFormMeta } from './form'

export type IRole = 'review' | 'publish' | 'qualityReview' | 'view' | 'author'

export interface IContentRender {
  name: string
  displayName: string
  icon: string,
  additionalMessage: string
  contentType: NSContent.IContentType | ''
  resourceType?: string
  mimeType: string
  hasEnabled: boolean
  canShow: boolean
  allowedRoles: string[]
  flow?: {
    internalFlow: {
      common: string[]
      conditional?: {
        condition: {
          [key in keyof NSContent.IContentMeta]: any[]
        }
        flow: string[],
      }[],
    }
    externalFlow: {
      common: string[]
      conditional?: {
        condition: {
          [key in keyof NSContent.IContentMeta]: any[]
        }
        flow: string[],
      }[],
    },
  },
  additionalMeta: {
    [key in keyof NSContent.IContentMeta]: any
  },
  children: string[]
}

export interface IInitialSetup {
  contentTypes: IContentRender[]
  form: IFormMeta
  roles: {
    [key in IRole]: {
      [key: string]: {
        condition: {
          [meta in keyof NSContent.IContentMeta]: any[]
        },
        fields?: string[],
      },
    }
  }
}
