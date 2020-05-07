/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsContent } from './widget-content.model'
export namespace NsShare {

  export interface IEmailContact {
    name?: string
    email: string
  }
  export interface IEmailArtifact {
    identifier: string
    title: string
    description: string
    thumbnailUrl: string
    authors: NsContent.IContact[]
    duration: string
    track: string
    url: string
    downloadUrl?: string
    size?: number
    artifactUrl?: string
  }
  export interface IEmailRequest {
    emailTo: IEmailContact[]
    ccTo?: IEmailContact[]
    bccTo?: IEmailContact[]
    sharedBy: IEmailContact[]
    body: { text: string, isHTML: boolean }
    timestamp: number
    appURL: string
    artifacts: IEmailArtifact[]
    emailType?: string
  }
  export interface IEmailResponse {
    response: string
    invalidIds?: string[]
  }

  export interface IShareRequest {
    'event-id': 'share_content'
    'target-data': ITargetData
    'tag-value-pair': ITagValuePair
    recipients: IRecipients
  }

  interface IRecipients {
    sharedWith: string[]
    sharedBy: string[]
  }

  interface ITagValuePair {
    '#contentType': string
    '#contentTitle': string
    '#targetUrl': string
    '#message'?: string
  }

  interface ITargetData {
    identifier: string
  }
}
