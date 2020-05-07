/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */

// imports for Angular library
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

// import for custom routing module
import { LearningHubHomeRoutingModule } from './home-routing.module'

// import for custom component
import { LearningHubHomeComponent } from './home.component'

@NgModule({
  declarations: [LearningHubHomeComponent],
  imports: [
    CommonModule,
    LearningHubHomeRoutingModule,
  ],
})
export class LearningHubHomeModule { }
