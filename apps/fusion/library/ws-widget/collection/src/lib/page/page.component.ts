/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { ConfigurationsService, EventService, LoggerService, NsPage, ValueService, WsEvents } from '@ws-widget/utils'

@Component({
  selector: 'ws-widget-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent extends WidgetBaseComponent
  implements OnInit, AfterViewInit, OnDestroy, NsWidgetResolver.IWidgetData<NsPage.IPage | null> {
  @Input() widgetData: NsPage.IPage | null = null
  pageData: NsPage.IPage | null = null
  oldData: NsPage.IPage | null = null
  alreadyRaised = false
  error: any
  isXSmall = false
  navBackground: Partial<NsPage.INavBackground> | null = null
  links: NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[] = []
  constructor(
    private activateRoute: ActivatedRoute,
    private logger: LoggerService,
    private configSvc: ConfigurationsService,
    private valueSvc: ValueService,
    private eventSvc: EventService,
  ) {
    super()
    this.valueSvc.isXSmall$.subscribe(isXSmall => {
      this.isXSmall = isXSmall
      this.links = this.getNavLinks()
    })
  }
  ngOnInit() {
    this.activateRoute.data.subscribe(routeData => {
      if (this.alreadyRaised && this.oldData) {
        this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded)
      }
      if (routeData.pageData && routeData.pageData.data) {
        this.error = null
        this.pageData = routeData.pageData.data
        if (this.pageData && this.pageData.navigationBar) {
          this.navBackground = this.pageData.navigationBar.background || this.configSvc.pageNavBar
          this.links = this.getNavLinks()
        }
      } else if (this.widgetData) {
        this.pageData = this.widgetData
        if (this.pageData && this.pageData.navigationBar) {
          this.navBackground = this.pageData.navigationBar.background || this.configSvc.pageNavBar
          this.links = this.getNavLinks()
        }
      } else {
        this.pageData = null
        this.error = routeData.pageData.error
        this.logger.warn('No page data available')
      }
      if (this.pageData) {
        this.oldData = this.pageData
        this.alreadyRaised = true
        this.raiseEvent(WsEvents.EnumTelemetrySubType.Loaded)
      }
    })
  }

  ngAfterViewInit() {
    const hash: any = window.location.hash ? window.location.hash.split('#')[1] : ''
    if (hash && isNaN(hash)) {
      setTimeout(
        () => {
          const element = document.getElementById(hash)
          if (element) {
            element.scrollIntoView()
          }
        },
        1000,
      )
    }
  }

  raiseEvent(state: WsEvents.EnumTelemetrySubType) {
    const path = window.location.pathname.replace('/', '')
    const event = {
      eventType: WsEvents.WsEventType.Telemetry,
      eventLogLevel: WsEvents.WsEventLogLevel.Info,
      from: 'channel-page',
      to: '',
      data: {
        state,
        type: WsEvents.WsTimeSpentType.Page,
        mode: WsEvents.WsTimeSpentMode.View,
        pageId: path,
      },
    }
    this.eventSvc.dispatchEvent(event)

  }
  getNavLinks(): NsWidgetResolver.IRenderConfigWithTypedData<NsPage.INavLink>[] {
    if (this.pageData && this.pageData.navigationBar && Array.isArray(this.pageData.navigationBar.links)) {
      if (this.isXSmall) {
        return this.pageData.navigationBar.links.map(link => ({
          ...link,
          widgetData: {
            ...link.widgetData,
            config: {
              ...link.widgetData.config,
              type: 'mat-menu-item',
            },
          },
        }))
      }
      return this.pageData.navigationBar.links
    }
    return []
  }
  ngOnDestroy() {
    if (this.pageData) {
      this.raiseEvent(WsEvents.EnumTelemetrySubType.Unloaded)
    }
  }

}
