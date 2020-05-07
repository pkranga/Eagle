/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageComponent } from './page.component'
import {
  MatToolbarModule,
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
  MatMenuModule,
} from '@angular/material'
import { RouterModule } from '@angular/router'

import { WidgetResolverModule } from '@ws-widget/resolver'
import { BtnPageBackModule } from '../btn-page-back/btn-page-back.module'
@NgModule({
  declarations: [PageComponent],
  imports: [
    CommonModule,
    RouterModule,
    WidgetResolverModule,
    BtnPageBackModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  exports: [PageComponent],
  entryComponents: [PageComponent],
})
export class PageModule { }
