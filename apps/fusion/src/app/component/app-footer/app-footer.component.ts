/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component } from '@angular/core'
import { ConfigurationsService } from '@ws-widget/utils'

@Component({
  selector: 'ws-app-footer',
  templateUrl: './app-footer.component.html',
  styleUrls: ['./app-footer.component.scss'],
})
export class AppFooterComponent {

path
  constructor(private configSvc: ConfigurationsService) {
    if (this.configSvc.instanceConfig) {
path
path
      } else {
path
      }
    }
  }

}
