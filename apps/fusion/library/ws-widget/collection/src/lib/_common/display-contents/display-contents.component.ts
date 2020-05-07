/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsContent } from '../../_services/widget-content.model'
import { UtilityService, ConfigurationsService } from '../../../../../utils/src/public-api'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-widget-display-contents[contents]',
  templateUrl: './display-contents.component.html',
  styleUrls: ['./display-contents.component.scss'],
})
export class DisplayContentsComponent implements OnInit {
  @Input() contents: NsContent.IContent[] = []
  @Input() durationType: 'total' | 'remaining' = 'total'

  viewMore = false
  MIN_CONTENT_DISPLAY = 5

  prefChangeSubscription: Subscription | null = null
  isIntranetAllowedSettings = false

  constructor(private utilitySvc: UtilityService, private configSvc: ConfigurationsService) { }

  ngOnInit() {
    this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    this.prefChangeSubscription = this.configSvc.prefChangeNotifier.subscribe(() => {
      this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    })
  }

  get isMobile(): boolean {
    return this.utilitySvc.isMobile
  }

  isGreyedOut(content: NsContent.IContent) {
    return (
      this.isInIntranetMobile(content) ||
      this.isDeletedOrExpired(content) ||
      this.hasNoAccess(content)
    )
  }

  isInIntranetMobile(content: NsContent.IContent) {
    return !this.isIntranetAllowedSettings && content.isInIntranet && this.utilitySvc.isMobile
  }

  isDeletedOrExpired(content: NsContent.IContent) {
    return content.status === 'Expired' || content.status === 'Deleted'
  }

  hasNoAccess(content: NsContent.IContent) {
    return !content.hasAccess
  }
}
