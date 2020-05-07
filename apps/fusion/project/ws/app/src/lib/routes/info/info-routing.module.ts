/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PageResolve } from '@ws-widget/utils'
import { AboutHomeComponent } from './about/components/about-home.component'
import { ContactHomeComponent } from './contact/components/contact-home.component'
import { FaqHomeComponent } from './faq/components/faq-home.component'
import { QuickTourComponent } from './quick-tour/quick-tour.component'

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'about',
  },

  {
    path: 'about',
    component: AboutHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'about',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'contact',
    component: ContactHomeComponent,

  },
  {
    path: 'faq',
    component: FaqHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'faq',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'tour',
    component: QuickTourComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfoRoutingModule { }
