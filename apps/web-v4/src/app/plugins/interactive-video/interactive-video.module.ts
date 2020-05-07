/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// material imports
import { MatButtonModule, MatDividerModule, MatRippleModule } from '@angular/material';
import { InteractionGroupManagerComponent } from './components/interaction-group-manager/interaction-group-manager.component';
// component imports
import { InteractiveVideoComponent } from './components/interactive-video/interactive-video.component';
// module imports
import { InteractiveVideoRoutingModule } from './interactive-video-routing.module';

@NgModule({
  declarations: [InteractiveVideoComponent, InteractionGroupManagerComponent],
  imports: [CommonModule, InteractiveVideoRoutingModule, MatButtonModule, MatDividerModule, MatRippleModule]
})
export class InteractiveVideoModule {}
