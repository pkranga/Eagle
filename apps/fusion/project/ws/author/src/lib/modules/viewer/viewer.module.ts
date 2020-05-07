/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { MatSelectModule, MatFormFieldModule, MatToolbarModule } from '@angular/material'
import { ViewerComponent } from './viewer.component'
import { ViewerRoutingModule } from './viewer-routing.module'
import { PipeSafeSanitizerModule } from '@ws-widget/utils'

@NgModule({
  declarations: [ViewerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatSelectModule,
    ViewerRoutingModule,
    PipeSafeSanitizerModule,
  ],
  exports: [
    ViewerComponent,
  ],
})
export class AuthViewerModule { }
