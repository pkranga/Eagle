/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { CustomDirectivesModule } from 'src/app/directives/custom-directives.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { ConceptGraphHomeComponent } from './components/concept-graph-home/concept-graph-home.component';
import { ConceptGraphComponent } from './components/concept-graph/concept-graph.component';
import { ConceptGraphRoutingModule } from './concept-graph-routing.module';

@NgModule({
  declarations: [ConceptGraphComponent, ConceptGraphHomeComponent],
  imports: [
    CommonModule,
    ConceptGraphRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    SpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    CustomDirectivesModule,
    MatExpansionModule
  ]
})
export class ConceptGraphModule {}
