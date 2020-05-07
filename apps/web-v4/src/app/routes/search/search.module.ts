/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule, MatTooltipModule } from '@angular/material';

import { UtilityModule } from '../../modules/utility/utility.module';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { ActionBottomSheetModule } from '../../modules/action-bottom-sheet/action-bottom-sheet.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';

import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './components/search/search.component';
import { ActionBtnModule } from '../../modules/action-btn/action-btn.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { ProgressModule } from '../../modules/progress/progress.module';
import { SearchResultsComponent } from './components/search-results/search-results.component';
import { SearchCardComponent } from './components/search-card/search-card.component';
import { SiemensModule } from '../../modules/siemens/siemens.module';
import { ChannelsModule } from '../../routes/channels/channels.module';

@NgModule({
  declarations: [SearchComponent, SearchResultsComponent, SearchCardComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SearchRoutingModule,
    CustomDirectivesModule,
    SiemensModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatCardModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatListModule,
    MatTooltipModule,
    ChannelsModule,
    ActionBtnModule,
    ActionBottomSheetModule,
    SpinnerModule,
    ProgressModule,
    UtilityModule,
    ScrollHandlerModule,
    CustomDirectivesModule
  ]
})
export class SearchModule { }
