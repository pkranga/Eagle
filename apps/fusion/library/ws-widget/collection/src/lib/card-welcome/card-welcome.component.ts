/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { ConfigurationsService } from '@ws-widget/utils'

@Component({
  selector: 'ws-widget-card-welcome',
  templateUrl: './card-welcome.component.html',
  styleUrls: ['./card-welcome.component.scss'],
})
export class CardWelcomeComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {

  @Input() widgetData: any
  givenName: string | undefined
  userEmail: string | undefined
  isNewUser = false
  constructor(
    private configSvc: ConfigurationsService,
  ) {
    super()
    if (this.configSvc.userProfile) {
      this.givenName = this.configSvc.userProfile.givenName
      this.userEmail = this.configSvc.userProfile.email
    }
    this.isNewUser = this.configSvc.isNewUser
  }

  ngOnInit() {
  }

}
