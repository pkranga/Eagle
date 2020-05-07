/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsContent } from '../../_services/widget-content.model'

@Component({
  selector: 'ws-widget-display-content-type-icon',
  templateUrl: './display-content-type-icon.component.html',
  styleUrls: ['./display-content-type-icon.component.scss'],
})
export class DisplayContentTypeIconComponent implements OnInit {

  @Input() displayContentType: NsContent.EDisplayContentTypes = NsContent.EDisplayContentTypes.DEFAULT
  displayContentTypeEnum = NsContent.EDisplayContentTypes
  constructor() { }

  ngOnInit() {
  }

}
