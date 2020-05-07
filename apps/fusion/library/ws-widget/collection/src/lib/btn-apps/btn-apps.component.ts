/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { ConfigurationsService, NsPage } from '@ws-widget/utils'
import { ROOT_WIDGET_CONFIG } from '../collection.config'
import { Subscription } from 'rxjs'
import { IBtnAppsConfig } from './btn-apps.model'

@Component({
  selector: 'ws-widget-btn-apps',
  templateUrl: './btn-apps.component.html',
  styleUrls: ['./btn-apps.component.scss'],
})
export class BtnAppsComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<IBtnAppsConfig> {
  @Input() widgetData!: IBtnAppsConfig
  isPinFeatureAvailable = true

  pinnedApps: NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[] = []
  featuredApps: NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[] = []

  private pinnedAppsSubs?: Subscription
  constructor(private configSvc: ConfigurationsService) {
    super()
  }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isPinFeatureAvailable = !this.configSvc.restrictedFeatures.has('pinFeatures')
    }
    this.setPinnedApps()
    this.setFeaturedApps()
  }
  ngOnDestroy() {
    if (this.pinnedAppsSubs) {
      this.pinnedAppsSubs.unsubscribe()
    }
  }
  setPinnedApps() {
    this.pinnedAppsSubs = this.configSvc.pinnedApps.subscribe(pinnedApps => {
      const appsConfig = this.configSvc.appsConfig
      if (!appsConfig) {
        return
      }
      this.pinnedApps = Array.from(pinnedApps)
        .filter(id => id in appsConfig.features)
        .map(id => ({
          widgetType: ROOT_WIDGET_CONFIG.actionButton._type,
          widgetSubType: ROOT_WIDGET_CONFIG.actionButton.feature,
          widgetHostClass: 'w-1/3 px-2 py-3 box-sizing-box',
          widgetData: {
            config: {
              type: 'feature-item',
              useShortName: true,
            },
            actionBtn: appsConfig.features[id],
          },
        }))
    })
  }

  setFeaturedApps() {
    const instanceConfig = this.configSvc.instanceConfig
    const appsConfig = this.configSvc.appsConfig

    if (instanceConfig && instanceConfig.featuredApps && appsConfig) {
      this.featuredApps = instanceConfig.featuredApps
        .filter(id => id in appsConfig.features)
        .map(
          (id: string): NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink> => ({
            widgetType: ROOT_WIDGET_CONFIG.actionButton._type,
            widgetSubType: ROOT_WIDGET_CONFIG.actionButton.feature,
            widgetHostClass: 'w-1/3 px-2 py-3 box-sizing-box',
            widgetData: {
              config: {
                type: 'feature-item',
                useShortName: true,
                hidePin: true,
              },
              actionBtn: appsConfig.features[id],
            },
          }),
        )
    }
  }
}
