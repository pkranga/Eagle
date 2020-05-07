/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CompassRoleComponent } from './components/compass-role/compass-role.component';
import { LearningPathComponent } from './components/learning-path/learning-path.component';
const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: CompassRoleComponent
  },
  // {
  //   path:'skills-role/:role_id',
  //   component: CompassRoleComponent
  // },
  {
    path: 'lp/:id',
    component: LearningPathComponent
  }
];
@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompassRoleRoutingModule {}
