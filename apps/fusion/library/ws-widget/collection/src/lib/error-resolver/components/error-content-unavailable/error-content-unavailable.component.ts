/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import { Subscription } from 'rxjs'
import { debounceTime } from 'rxjs/operators'

import { ConfigurationsService } from '@ws-widget/utils'

import { IWidgetErrorAccessForbidden } from '../error-access-forbidden/error-access-forbidden.model'
@Component({
  selector: 'ws-widget-error-content-unavailable',
  templateUrl: './error-content-unavailable.component.html',
  styleUrls: ['./error-content-unavailable.component.scss'],
})
export class ErrorContentUnavailableComponent implements OnInit, OnDestroy {
  @Input() errorData: null | IWidgetErrorAccessForbidden = null
  isDarkMode: boolean = this.configurationsSvc.isDarkMode

  private prefChangeSubs: Subscription | null = null
  private routeChangeSubs: Subscription | null = null

  constructor(private route: ActivatedRoute, private configurationsSvc: ConfigurationsService) {}
  ngOnInit() {
    if (!this.errorData) {
      this.routeChangeSubs = this.route.data.subscribe(response => {
        if (response.pageData.data) {
          this.errorData = response.pageData.data
        } else {
          this.errorData = null
        }
      })
    }
    this.prefChangeSubs = this.configurationsSvc.prefChangeNotifier
      .pipe(debounceTime(500))
      .subscribe(() => {
        this.isDarkMode = this.configurationsSvc.isDarkMode
      })
  }
  ngOnDestroy() {
    if (this.prefChangeSubs) {
      this.prefChangeSubs.unsubscribe()
    }
    if (this.routeChangeSubs) {
      this.routeChangeSubs.unsubscribe()
    }
  }
}
