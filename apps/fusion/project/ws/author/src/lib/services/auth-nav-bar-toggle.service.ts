/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { ReplaySubject } from 'rxjs'
import { Injectable } from '@angular/core'

@Injectable()
export class AuthNavBarToggleService {

  private _isVisible = true
  toggleNavBar = new ReplaySubject<boolean>()
  constructor() { }

  set isVisible(visible: boolean) {
    this._isVisible = visible
  }

  get isVisible() {
    return this._isVisible
  }

  toggle(visible: boolean) {
    this.isVisible = visible
    this.toggleNavBar.next(this.isVisible)
  }
}
