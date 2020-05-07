/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { BtnPageBackService } from './btn-page-back.service'
import { Router } from '@angular/router'

type TUrl = undefined | 'none' | 'back' | string
@Component({
  selector: 'ws-widget-btn-page-back',
  templateUrl: './btn-page-back.component.html',
  styleUrls: ['./btn-page-back.component.scss'],
})
export class BtnPageBackComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<{ url: TUrl }> {
  @Input() widgetData: { url: TUrl } = { url: 'none' }

  constructor(
    private btnBackSvc: BtnPageBackService,
    private router: Router,
  ) {
    super()
  }
  newUrl = ''

  ngOnInit() {
    this.newUrl = this.router.url

  }

  get backUrl(): { fragment?: string; routeUrl: string; queryParams: any } {

    if (this.newUrl === '/page/explore') {
      return {
        queryParams: undefined,
        routeUrl: '/page/home',
      }
    }
    if (this.widgetData.url === 'doubleBack') {
      return {
        fragment: this.btnBackSvc.getLastUrl(2).fragment,
        queryParams: this.btnBackSvc.getLastUrl(2).queryParams,
        routeUrl: this.btnBackSvc.getLastUrl(2).route,
      }
    } if (this.widgetData.url === 'back') {
      return {
        fragment: this.btnBackSvc.getLastUrl().fragment,
        queryParams: this.btnBackSvc.getLastUrl().queryParams,
        routeUrl: this.btnBackSvc.getLastUrl().route,
      }
    }

    return {
      queryParams: undefined,
      routeUrl: this.widgetData.url ? this.widgetData.url : '/app/home',
    }
  }
}
