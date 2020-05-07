/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// material modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material';

import { UtilityModule } from '../utility/utility.module';
import { ProgressModule } from '../progress/progress.module';
import { ActionBtnModule } from '../action-btn/action-btn.module';
import { ActionBottomSheetModule } from '../action-bottom-sheet/action-bottom-sheet.module';

import { ContentCardComponent } from './components/content-card/content-card.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { ContentSimplifiedCardComponent } from './components/content-simplified-card/content-simplified-card.component';

@NgModule({
  declarations: [ContentCardComponent, ContentSimplifiedCardComponent],
  imports: [
    CommonModule,
    RouterModule,
    ActionBtnModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    ProgressModule,
    UtilityModule,
    CustomDirectivesModule,
    ActionBottomSheetModule
  ],
  exports: [ContentCardComponent, ContentSimplifiedCardComponent]
})
export class CardsModule {}
