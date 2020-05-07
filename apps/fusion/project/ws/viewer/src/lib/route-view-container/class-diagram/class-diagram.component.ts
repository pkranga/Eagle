/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input } from '@angular/core'
import {
  NsContent,
} from '@ws-widget/collection'

@Component({
  selector: 'viewer-class-diagram-container',
  templateUrl: './class-diagram.component.html',
  styleUrls: ['./class-diagram.component.scss'],
})
export class ClassDiagramComponent {
  @Input() isLtMedium = false
  @Input() isFetchingDataComplete = false
  @Input() isErrorOccured = false
  @Input() classDiagramData: NsContent.IContent | null = null
  @Input() classDiagramManifest: any

  constructor(
  ) { }
}
