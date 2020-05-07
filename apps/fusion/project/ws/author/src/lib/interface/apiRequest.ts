/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NSContent } from './content'
import {
  CONTENT_BASE_STATIC,
  CONTENT_BASE_STREAM,
  CONTENT_BASE_WEBHOST,
  CONTENT_BASE_WEBHOST_ASSETS,
} from '../constants/apiEndpoints'

export namespace NSApiRequest {

  export interface ICreateMetaRequestGeneral {
    name: string,
    description: string,
    mimeType: string,
    contentType: string,
    resourceType?: string,
    isTranslationOf?: string,
    locale?: string,
  }

  export interface ICreateMetaRequest {
    content: {
      name: string,
      description: string,
      mimeType: string,
      contentType: string,
      createdBy: string,
      resourceType?: string,
      locale: string,
    }
  }

  export interface IForwadBackwardActionGeneral {
    comment: string
    operation: 1 | 0 | -1
  }

  export interface IForwadBackwardAction {
    actor: string,
    comment: string
    operation: 1 | 0 | -1,
    appName: string,
    appUrl: string,
    rootOrg: string,
    org: string,
  }

  export interface IContentUpdate {
    nodesModified: {
      [key: string]: {
        isNew: boolean,
        root: boolean,
        metadata: NSContent.IContentMeta,
      },
    },
    hierarchy: {} | { [key: string]: { root: boolean, children: string[] } }
  }

  export interface IContentData {
    contentId: string
    contentType: typeof CONTENT_BASE_STATIC | typeof CONTENT_BASE_STREAM |
    typeof CONTENT_BASE_WEBHOST | typeof CONTENT_BASE_WEBHOST_ASSETS
  }

}
