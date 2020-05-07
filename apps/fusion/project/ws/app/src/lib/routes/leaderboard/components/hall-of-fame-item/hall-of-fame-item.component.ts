/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IHallOfFameItem } from '../../models/leaderboard.model'

@Component({
  selector: 'ws-app-hall-of-fame-item',
  templateUrl: './hall-of-fame-item.component.html',
  styleUrls: ['./hall-of-fame-item.component.scss'],
})
export class HallOfFameItemComponent implements OnInit {
  @Input() hallOfFameItem!: IHallOfFameItem

  constructor() {}

  ngOnInit() {}
}
