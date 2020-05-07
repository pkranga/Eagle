/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable, Type } from '@angular/core'
import { AppTocOverviewComponent } from '../../components/app-toc-overview/app-toc-overview.component'
path
import { ConfigurationsService, EInstance } from '@ws-widget/utils'

@Injectable({
  providedIn: 'root',
})
export class AppTocOverviewService {

  constructor(
    private configSvc: ConfigurationsService,
  ) { }

  getComponent(): Type<any> {
    switch (this.configSvc.rootOrg) {
path
        return AppTocOverviewPathfindersComponent
      default:
        return AppTocOverviewComponent
    }
  }
}
