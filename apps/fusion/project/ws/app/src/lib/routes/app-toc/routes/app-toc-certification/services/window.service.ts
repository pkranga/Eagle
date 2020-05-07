/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// This file defines providers for the native Window object.

import { InjectionToken, PLATFORM_ID, FactoryProvider, ClassProvider } from '@angular/core'
import { isPlatformBrowser } from '@angular/common'

import { WindowRef } from '../classes/WindowRef'
import { BrowserWindowRef } from '../classes/BrowserWindowRef'

export const WINDOW = new InjectionToken('WindowToken')

// Factory function for Window object
export const windowFactory = (browserWindowRef: BrowserWindowRef, platformId: Object) => {
  if (isPlatformBrowser(platformId)) {
    return browserWindowRef.nativeWindow
  }
  return new Object()
}

// PROVIDERS

// Need to provide BrowserWindowRef before windowFactory as it is a dependency of the latter.
export const browserWindowProvider: ClassProvider = {
  provide: WindowRef,
  useClass: BrowserWindowRef,
}

// Provide windowFactory AFTER BrowserWindowRef is injected.
export const windowProvider: FactoryProvider = {
  provide: WINDOW,
  useFactory: windowFactory,
  deps: [WindowRef, PLATFORM_ID],
}

// PROVIDERS LIST TO BE INJECTED
export const WINDOW_PROVIDERS = [browserWindowProvider, windowProvider]
