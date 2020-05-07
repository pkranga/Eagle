/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { BtnFeatureComponent } from './btn-feature.component'
import { RouterModule } from '@angular/router'
import {
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatCardModule,
  MatMenuModule,
  MatRippleModule,
  MatBadgeModule,
} from '@angular/material'
import { WidgetUrlResolverDirective } from './widget-url-resolver.directive'

@NgModule({
  declarations: [BtnFeatureComponent, WidgetUrlResolverDirective],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    MatRippleModule,
    MatBadgeModule,
  ],
  exports: [BtnFeatureComponent],
  entryComponents: [BtnFeatureComponent],
})
export class BtnFeatureModule {}
