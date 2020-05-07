/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// material
import {
  MatButtonModule,
  MatDividerModule,
  MatRippleModule
} from '@angular/material';

import { InteractiveVideoComponent } from './components/interactive-video/interactive-video.component';
import { InteractionGroupManagerComponent } from './components/interaction-group-manager/interaction-group-manager.component';
@NgModule({
  declarations: [InteractiveVideoComponent, InteractionGroupManagerComponent],
  imports: [CommonModule, MatButtonModule, MatDividerModule, MatRippleModule],
  exports: [InteractiveVideoComponent]
})
export class InteractiveVideoModule {}
