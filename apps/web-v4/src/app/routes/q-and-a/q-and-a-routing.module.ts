/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QandaHomeComponent } from './components/qanda-home/qanda-home.component';
import { QandaViewComponent } from './components/qanda-view/qanda-view.component';
import { QandaAskComponent } from './components/qanda-ask/qanda-ask.component';
import { QandaMeComponent } from './components/qanda-me/qanda-me.component';
const routes: Routes = [
  {
    path: '',
    component: QandaHomeComponent
  },
  {
    path: 'me',
    component: QandaMeComponent
  },
  {
    path: 'ask',
    component: QandaAskComponent
  },
  {
    path: ':id',
    component: QandaViewComponent
  },
  {
    path: 'ask/:id',
    component: QandaAskComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QandARoutingModule {}
