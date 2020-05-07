/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// imports for Angular Library
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

// imports for Custom components
import { LearningHubHomeComponent } from './home.component'

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: LearningHubHomeComponent,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class LearningHubHomeRoutingModule { }
