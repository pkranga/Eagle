/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogRoutingModule } from './catalog-routing.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatTreeModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatRippleModule
} from '@angular/material';

import { CatalogComponent } from './components/catalog/catalog.component';
import { CatalogDetailsComponent } from './components/catalog-details/catalog-details.component';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';

@NgModule({
  declarations: [CatalogComponent, CatalogDetailsComponent],
  imports: [
    CommonModule,
    CatalogRoutingModule,
    MatTreeModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatRippleModule,
    SearchStripModule,
    SpinnerModule
  ]
})
export class CatalogModule {}
