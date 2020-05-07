/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// component imports
import { CollectionComponent } from './components/collection/collection.component';

// module imports
import { CollectionRoutingModule } from './collection-routing.module';

// material imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [CollectionComponent],
  imports: [
    CommonModule,
    CollectionRoutingModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatDividerModule,
    FormsModule
  ]
})
export class CollectionModule {}
