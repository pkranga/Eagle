/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// module imports
import { PlayerRoutingModule } from './player-routing.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { ActionBtnModule } from '../../modules/action-btn/action-btn.module';
import { ElementFullscreenModule } from '../../modules/element-fullscreen/element-fullscreen.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';

// component imports
import { PlayerComponent } from './components/player/player.component';

// library imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {
  MatButtonModule,
  MatTreeModule,
  MatDialogModule
} from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { PlayerTocComponent } from './components/player-toc/player-toc.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { PartOfComponent } from './components/part-of/part-of.component';

@NgModule({
  declarations: [
    PlayerComponent,
    PlayerTocComponent,
    RecommendationsComponent,
    PartOfComponent
  ],
  imports: [
    CommonModule,
    PlayerRoutingModule,
    ActionBtnModule,
    UtilityModule,
    ElementFullscreenModule,
    CustomDirectivesModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatRippleModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDialogModule
  ]
})
export class PlayerModule {}
