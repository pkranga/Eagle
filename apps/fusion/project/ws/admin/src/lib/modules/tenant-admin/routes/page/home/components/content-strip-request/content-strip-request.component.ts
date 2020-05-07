/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsContentStripRequest } from '../../models/content-strip-request.model'

@Component({
  selector: 'ws-admin-content-strip-request',
  templateUrl: './content-strip-request.component.html',
  styleUrls: ['./content-strip-request.component.scss'],
})
export class ContentStripRequestComponent implements OnInit {

  @Input() stripData!: any
  contentStripRequestType = NsContentStripRequest.EContentStripRequestTypes
  type: NsContentStripRequest.EContentStripRequestTypes =
    NsContentStripRequest.EContentStripRequestTypes.SEARCH_REQUEST

  constructor() { }

  createRequest(event: any) {
    this.stripData.request = JSON.parse(JSON.stringify(event))
  }

  preSelectedRequestIds() {
    if (this.stripData && this.stripData.request && this.stripData.request.ids) {
      return this.stripData.request.ids
    }
    return []
  }

  ngOnInit() {
  }
}
