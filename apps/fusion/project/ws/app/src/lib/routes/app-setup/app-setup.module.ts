/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { AppSetupRoutingModule } from './app-setup-routing.module'
import { AppSetupHomeComponent } from './app-setup-home.component'
import {
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatRadioModule,
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { InterestModule } from '../profile/routes/interest/interest.module'
import { SettingsModule } from '../profile/routes/settings/settings.module'
import { WidgetResolverModule } from '@ws-widget/resolver'
import { LocaleTranslatorModule } from '@ws-widget/collection'
import { AboutVideoModule } from '../info/about-video/about-video.module'

@NgModule({
  declarations: [AppSetupHomeComponent],
  imports: [
    CommonModule,
    AppSetupRoutingModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,

    InterestModule,
    SettingsModule,
    AboutVideoModule,
    WidgetResolverModule,
    LocaleTranslatorModule,
  ],
})
export class AppSetupModule { }
