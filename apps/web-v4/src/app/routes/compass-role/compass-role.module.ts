/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompassRoleRoutingModule } from './compass-role-routing.module';
import { DemoMaterialModule } from './materialmodule';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { CompassRoleComponent } from './components/compass-role/compass-role.component';
import { LearningPathComponent } from './components/learning-path/learning-path.component';
import { CardComponent } from './components/card/card.component';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';

@NgModule({
  declarations: [CompassRoleComponent, LearningPathComponent, CardComponent],
  imports: [
    CommonModule,
    CompassRoleRoutingModule,
    DemoMaterialModule,
    SpinnerModule,
    ScrollHandlerModule,
    CustomDirectivesModule
  ]
})
export class CompassRoleModule {}
