/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input } from '@angular/core'
import {
  NsContent,
} from '@ws-widget/collection'

@Component({
  selector: 'viewer-certification-container',
  templateUrl: './certification.component.html',
  styleUrls: ['./certification.component.scss'],
})
export class CertificationComponent {
  @Input() isFetchingDataComplete = false
  @Input() certificationData: NsContent.IContent | null = null
  constructor() { }
}
