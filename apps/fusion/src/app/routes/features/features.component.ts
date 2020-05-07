/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { FormControl } from '@angular/forms'
import { Subscription } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router'
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators'
import { NsAppsConfig, ConfigurationsService, NsPage, LogoutComponent } from '@ws-widget/utils'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ROOT_WIDGET_CONFIG } from '@ws-widget/collection'
import { MatDialog } from '@angular/material'
interface IGroupWithFeatureWidgets extends NsAppsConfig.IGroup {
  featureWidgets: NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[]
}
@Component({
  selector: 'ws-app-root-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit, OnDestroy {
  queryControl = new FormControl(this.activateRoute.snapshot.queryParamMap.get('q'))
  private readonly featuresConfig: IGroupWithFeatureWidgets[] = []
  featureGroups: IGroupWithFeatureWidgets[] | null = null
  pageNavbar: Partial<NsPage.INavBackground> = this.configurationSvc.pageNavBar
  private queryChangeSubs: Subscription | null = null

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private configurationSvc: ConfigurationsService,
  ) {
    if (this.configurationSvc.appsConfig) {
      const appsConfig = this.configurationSvc.appsConfig
      this.featuresConfig = appsConfig.groups.map(
        (group: NsAppsConfig.IGroup): IGroupWithFeatureWidgets => ({
          ...group,
          featureWidgets: group.featureIds.map(
            (id: string): NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink> =>
              ({
                widgetType: ROOT_WIDGET_CONFIG.actionButton._type,
                widgetSubType: ROOT_WIDGET_CONFIG.actionButton.feature,
                widgetHostClass: 'my-2 px-2 w-1/2 sm:w-1/3 md:w-1/6 w-lg-1-8 box-sizing-box',
                widgetData: {
                  config: {
                    type: 'feature-item',
                    useShortName: false,
                    treatAsCard: true,
                  },
                  actionBtn: appsConfig.features[id],
                },
              }),
          ),
        }),
      )
    }
  }

  ngOnInit() {
    this.queryChangeSubs = this.queryControl.valueChanges
      .pipe(
        startWith(this.activateRoute.snapshot.queryParamMap.get('q')),
        debounceTime(500),
        distinctUntilChanged(),
      )
      .subscribe((query: string) => {
        this.router.navigate([], { queryParams: { q: query || null } })
        this.featureGroups = this.filteredFeatures(query)
      })
  }
  ngOnDestroy() {
    if (this.queryChangeSubs) {
      this.queryChangeSubs.unsubscribe()
    }
  }
  clear() {
    this.queryControl.setValue('')
  }
  private filteredFeatures(query: string): IGroupWithFeatureWidgets[] {
    if (!query && this.featuresConfig) {
      return this.featuresConfig
    }
    if (this.featuresConfig === null) {
      return []
    }
    const q = query.toLowerCase()
    return this.featuresConfig
      .map(g => ({
        ...g,
        featureWidgets: g.featureWidgets.filter(featureWidget =>
          this.queryMatchForFeature(featureWidget.widgetData.actionBtn, q),
        ),
      }))
      .filter(group => group.featureWidgets && group.featureWidgets.length > 0)
  }

  private queryMatchForFeature(feature: NsAppsConfig.IFeature | undefined, query: string): boolean {
    if (feature) {
      return Boolean(
        feature.name.includes(query) ||
        feature.keywords.some(keyword => keyword.includes(query)) ||
        (feature.description && feature.description.includes(query)),
      )
    }
    return false
  }

  logout() {
    this.dialog.open<LogoutComponent>(LogoutComponent)
  }
}
