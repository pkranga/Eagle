/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { INavigatorCardModel } from '../../../../models/navigator.model'
import { Router } from '@angular/router'
import { ConfigurationsService, ValueService, TFetchStatus } from '@ws-widget/utils'
import { NavigatorService } from '../../../../services/navigator.service'

@Component({
  selector: 'ws-app-navigator-card',
  templateUrl: './navigator-card.component.html',
  styleUrls: ['./navigator-card.component.scss'],
})
export class NavigatorCardComponent implements OnInit {
  @Input() navigatorCard!: INavigatorCardModel
  baseLpUrl = '/app/infy/navigator/lp/'
  baseFsUrl = '/app/infy/navigator/fs/program/'
  defaultThumbnail = '/assets/images/missing-thumbnail.png'

  fetchStatus: TFetchStatus = 'none'

  isXSmall$ = this.valueSvc.isXSmall$
  screenSizeIsLtMedium = false
  constructor(private router: Router,
              private configSvc: ConfigurationsService,
              private valueSvc: ValueService,
              private navSvc: NavigatorService) { }

  ngOnInit() {
    this.navSvc.fetchImageForContentID(this.navigatorCard.linkedIds).subscribe(res => {
      // console.log('res', res, res[0], res[0].appIcon)
      if (res) {
        this.navigatorCard.thumbnail = res[0].appIcon
      } else {
        if (this.configSvc.instanceConfig) {
          this.defaultThumbnail = this.configSvc.instanceConfig.logos.defaultContent
          // console.log('default', this.defaultThumbnail, res[0].appIcon)
        }
      }
      this.fetchStatus = 'done'
    })
    this.isXSmall$.subscribe((isXSmall: boolean) => {
      this.screenSizeIsLtMedium = isXSmall
    })
  }

  imageClicked(navType: string) {
    if (navType === 'lp') {
      this.router.navigate([this.baseLpUrl + this.navigatorCard.routeButton])
    } else {
      this.router.navigate([this.baseFsUrl + this.navigatorCard.routeButton])
    }
  }
}
