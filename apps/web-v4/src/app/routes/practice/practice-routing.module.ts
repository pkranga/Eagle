/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PracticeComponent } from './components/practice/practice.component';
import { ProctoringComponent } from './components/proctoring/proctoring.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home'
  },
  {
    path: 'hands-on/:type',
    component: PracticeComponent
  },
  {
    path: 'proctoring',
    component: ProctoringComponent
  },
  {
    path: 'proctoring/:contentid',
    component: ProctoringComponent
  },
  {
    path: ':type',
    component: PracticeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PracticeRoutingModule {}
