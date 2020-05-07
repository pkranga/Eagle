/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IUserGoalSharedWith } from '../../../../models/goal.model';

@Component({
  selector: 'app-action-required',
  templateUrl: './action-required.component.html',
  styleUrls: ['./action-required.component.scss']
})
export class ActionRequiredComponent implements OnInit {

  @Input()
  goalsSharedWithUser: IUserGoalSharedWith[];

  constructor() { }

  ngOnInit() {
  }

}
