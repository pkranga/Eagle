/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AboutVideoComponent } from './about-video.component'
import { MatRadioModule } from '@angular/material'
import { LocaleTranslatorModule } from '@ws-widget/collection'
import { WidgetResolverModule } from '@ws-widget/resolver'

@NgModule({
  declarations: [AboutVideoComponent],
  imports: [
    CommonModule,
    MatRadioModule,

    WidgetResolverModule,
    LocaleTranslatorModule,
  ],
  exports: [AboutVideoComponent],
})
export class AboutVideoModule { }
