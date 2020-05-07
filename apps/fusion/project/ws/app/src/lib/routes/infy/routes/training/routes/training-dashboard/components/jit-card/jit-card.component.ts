/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IJITRequest } from '../../../../models/training-api.model'

@Component({
  selector: 'ws-app-jit-card',
  templateUrl: './jit-card.component.html',
  styleUrls: ['./jit-card.component.scss'],
})
export class JitCardComponent implements OnInit {
  @Input() jitRequest!: IJITRequest
  trackLeads!: string[]
  trackAnchors!: string[]

  constructor() {}

  ngOnInit() {
    this.trackLeads = this.jitRequest.track_lead.split(', ')
    this.trackAnchors = this.jitRequest.track_anchor.split(', ')
  }
}
