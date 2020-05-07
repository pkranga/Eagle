/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WsPagesModule } from '../../modules/ws-pages/ws-pages.module';
import { PagesHomeComponent } from './components/pages-home/pages-home.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SiemensModule } from '../../modules/siemens/siemens.module'


@NgModule({
  declarations: [PagesHomeComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    WsPagesModule,
    SiemensModule
  ]
})
export class PagesModule { }
