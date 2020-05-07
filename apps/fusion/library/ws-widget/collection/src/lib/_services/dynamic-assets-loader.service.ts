/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { fromEvent } from 'rxjs'
import { first, tap, map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root',
})
export class DynamicAssetsLoaderService {
  urlLoadStatus = new Map<string, boolean>()
  urlElemMapping = new Map<string, HTMLScriptElement>()
  constructor() { }

  async loadScript(url: string) {
    if (this.urlLoadStatus.get(url)) {
      return true
    }
    try {
      if (this.urlElemMapping.has(url)) {
        return this.loadEventPromise(url)
      }
      const scriptElem = document.createElement('script')
      scriptElem.src = url
      document.body.appendChild(scriptElem)
      this.urlElemMapping.set(url, scriptElem)
      return this.loadEventPromise(url)
    } catch (err) {
      return false
    }
  }
  async loadStyle(url: string): Promise<boolean> {
    if (this.urlLoadStatus.get(url)) {
      return true
    }
    try {
      const linkElem = document.createElement('link')
      linkElem.rel = 'stylesheet'
      linkElem.href = url
      document.body.appendChild(linkElem)
      this.urlLoadStatus.set(url, true)
      return true
    } catch (err) {
      return false
    }
  }

  private async loadEventPromise(url: string): Promise<boolean> {
    const elem = this.urlElemMapping.get(url)
    if (!elem) {
      return true
    }
    return fromEvent(elem, 'load')
      .pipe(
        first(),
        tap(() => {
          this.urlLoadStatus.set(url, true)
          this.urlElemMapping.delete(url)
        }),
        map(() => true),
      )
      .toPromise()
  }
}
