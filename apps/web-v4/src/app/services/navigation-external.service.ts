/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { NAVIGATION_DATA_INCOMING } from '../models/mobile-apps-events.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationExternalService {
  constructor(private router: Router) {
    fromEvent(document, NAVIGATION_DATA_INCOMING).subscribe((event: CustomEventInit) => {
      this.navigateTo(event.detail.url, event.detail.params);
    });
  }
  navigateTo(url: string, params?: any) {
    params = params || {};
    params.ref = encodeURIComponent(params.ref || this.router.url.replace(/ref=[^&]*&?/, '').replace(/\?$/, ''));
    this.router.navigate([url], { queryParams: params });
  }
}
