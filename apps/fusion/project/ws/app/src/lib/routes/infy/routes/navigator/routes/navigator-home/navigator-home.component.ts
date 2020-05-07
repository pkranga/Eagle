/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component } from '@angular/core'
import { ConfigurationsService } from '@ws-widget/utils'

@Component({
  selector: 'ws-app-navigator-home',
  templateUrl: './navigator-home.component.html',
  styleUrls: ['./navigator-home.component.scss'],
})
export class NavigatorHomeComponent {

  selectedIndex = 0
  constructor(public configSvc: ConfigurationsService) { }
}
