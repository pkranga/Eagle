/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsContent } from '../_services/widget-content.model'

export namespace NsCardContent {
  export interface ICard {
    content: NsContent.IContent
    cardSubType: TCardSubType
    context: { pageSection: string, position?: number }
    intranetMode?: 'greyOut' | 'hide'
    deletedMode?: 'greyOut' | 'hide'
    likes?: number
  }
  export type TCardSubType = 'standard' | 'minimal' | 'space-saving' | 'card-user-details' | 'basic-info'

  export enum EContentStatus {
    LIVE = 'Live',
    EXPIRED = 'Expired',
    DELETED = 'Deleted',
    MARK_FOR_DELETION = 'MarkedForDeletion',
  }
}
