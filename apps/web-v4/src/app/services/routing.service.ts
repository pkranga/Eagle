/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {
  public previousRouteUrls: string[] = [];
  constructor() {}

  getLastUrl() {
    let lastUrl: string = this.previousRouteUrls[
      this.previousRouteUrls.length - 1
    ];
    let fragment;
    if (!lastUrl) {
      lastUrl = '/';
      this.previousRouteUrls.push(lastUrl);
    }
    if (lastUrl.includes('#')) {
      const urlFragmentParts = lastUrl.split('#');
      lastUrl = urlFragmentParts[0];
      fragment = urlFragmentParts[1];
    }
    return {
      route: lastUrl.split('?')[0],
      qparams: this.getQParams(lastUrl.split('?')[1]),
      fragment
    };
  }

  getQParams(qparamsUrl: string) {
    if (!qparamsUrl || !qparamsUrl.length) {
      return undefined;
    }
    while (this.isUrlEncoded(qparamsUrl)) {
      qparamsUrl = decodeURIComponent(qparamsUrl);
    }
    const qParamsArr = qparamsUrl.split('&');
    let errorFlag = 0;
    const qparams = qParamsArr.reduce((acc, url) => {
      const splitUrls = url.split('=');
      if (splitUrls.length === 1) {
        errorFlag = 1;
        return;
      }
      acc[splitUrls[0]] = splitUrls[1];
      return acc;
    }, {});
    if (errorFlag) {
      return undefined;
    }
    return qparams;
  }

  isUrlEncoded(url): boolean {
    url = url || '';
    return url !== decodeURIComponent(url);
  }
}
