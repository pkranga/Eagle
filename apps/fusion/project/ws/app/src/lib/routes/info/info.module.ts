/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AboutModule } from './about/about.module'
import { ContactModule } from './contact/contact.module'
import { FaqModule } from './faq/faq.module'
import { InfoRoutingModule } from './info-routing.module'
import { QuickTourModule } from './quick-tour/quick-tour.module'
import { AboutVideoModule } from './about-video/about-video.module'

@NgModule({
  declarations: [],
  imports: [CommonModule, InfoRoutingModule, AboutModule, ContactModule, FaqModule, QuickTourModule, AboutVideoModule],
})
export class InfoModule { }
