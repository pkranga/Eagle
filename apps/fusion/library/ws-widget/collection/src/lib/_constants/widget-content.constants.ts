/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsContent } from '../_services/widget-content.model'

export namespace NsContentConstants {
  export const EMBEDDABLE_CONTENT_TYPES = new Set<NsContent.EMimeTypes>([
    NsContent.EMimeTypes.MP3,
    NsContent.EMimeTypes.MP4,
    NsContent.EMimeTypes.PDF,
  ])
  export const ALLOW_MAIL_ME = new Set<string>(['Leave Behind'])
  export const VALID_PRACTICE_RESOURCES = new Set([
    'Exercise',
    'Capstone Project',
    'Tryout',
  ])
  export const VALID_ASSESSMENT_RESOURCES = new Set(['Quiz', 'Assessment'])
}
