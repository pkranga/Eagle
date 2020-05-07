/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentStripModule } from '../content-strip/content-strip.module';

import { SearchStripComponent } from './components/search-strip/search-strip.component';
import { RouterModule } from '@angular/router';
import { CommonMaterialModule } from '../common-material/common-material.module';

@NgModule({
  declarations: [SearchStripComponent],
  imports: [CommonModule, RouterModule, ContentStripModule, CommonMaterialModule],
  exports: [SearchStripComponent]
})
export class SearchStripModule {}
