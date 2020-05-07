/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input } from '@angular/core'
import {
  NsContent,
} from '@ws-widget/collection'

@Component({
  selector: 'viewer-hands-on-container',
  templateUrl: './hands-on.component.html',
  styleUrls: ['./hands-on.component.scss'],
})
export class HandsOnComponent {
  @Input() isFetchingDataComplete = false
  @Input() isErrorOccured = false
  @Input() handsOnData: NsContent.IContent | null = null
  @Input() handsOnManifest: any
  constructor() { }
}
