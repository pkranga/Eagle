/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IBadge } from '../../badges.model'

@Component({
  selector: 'ws-app-badges-not-earned',
  templateUrl: './badges-not-earned.component.html',
  styleUrls: ['./badges-not-earned.component.scss'],
})
export class BadgesNotEarnedComponent implements OnInit {
  constructor() { }
  @Input()
  badge!: IBadge

  ngOnInit() { }
}
