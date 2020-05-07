/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SlidersComponent } from './sliders.component'
import { RouterModule } from '@angular/router'
import { NavigationModule, ImageResponsiveModule } from '@ws-widget/utils'

import { HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser'
export class MyHammerConfig extends HammerGestureConfig {
  buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: 'pan-y',
    })
    return mc
  }
}

// tslint:disable-next-line: max-classes-per-file
@NgModule({
  declarations: [SlidersComponent],
  imports: [
    CommonModule,
    RouterModule,
    NavigationModule,
    ImageResponsiveModule,
  ],
  entryComponents: [SlidersComponent],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig,
    },
  ],
})
export class SlidersModule { }
