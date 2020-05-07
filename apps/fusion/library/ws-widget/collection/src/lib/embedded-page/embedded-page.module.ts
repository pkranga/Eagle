/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EmbeddedPageComponent } from './embedded-page.component'
import { MatIconModule, MatToolbarModule } from '@angular/material'
import { BtnPageBackModule } from '../btn-page-back/btn-page-back.module'

@NgModule({
  declarations: [EmbeddedPageComponent],
  imports: [CommonModule, BtnPageBackModule, MatIconModule, MatToolbarModule],
  exports: [EmbeddedPageComponent],
  entryComponents: [EmbeddedPageComponent],
})
export class EmbeddedPageModule {}
