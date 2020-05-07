/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IWsChannelInitiativesData } from '../../models/channels.model'

@Component({
  selector: 'ws-app-initiatives-card',
  templateUrl: './initiatives-card.component.html',
  styleUrls: ['./initiatives-card.component.scss'],
})
export class InitiativesCardComponent implements OnInit {
  @Input() initiativesData: IWsChannelInitiativesData[] | null = null

  constructor() {}

  ngOnInit() {}
}
