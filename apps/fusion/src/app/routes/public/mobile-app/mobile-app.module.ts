/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MobileAppHomeComponent } from './components/mobile-app-home.component'
import {
  MatCardModule,
  MatTabsModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
} from '@angular/material'
import { BtnPageBackModule } from '@ws-widget/collection'

@NgModule({
  declarations: [MobileAppHomeComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatButtonModule,
    BtnPageBackModule,
  ],
  exports: [MobileAppHomeComponent],
})
export class MobileAppModule {}
