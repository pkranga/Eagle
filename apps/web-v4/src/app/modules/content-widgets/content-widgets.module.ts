/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'
// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerModule } from '../spinner/spinner.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { ContentStripModule } from '../content-strip/content-strip.module';
import { ScrollHandlerModule } from '../scroll-handler/scroll-handler.module';
import { SearchStripModule } from '../search-strip/search-strip.module';
import { CarouselModule } from '../carousel/carousel.module';
import { MatDividerModule } from '@angular/material/divider';
import { CoursesForYouComponent } from './components/courses-for-you/courses-for-you.component'
import { CertificationComponent } from './components/certification/certification.component';
import { ContinueLearningComponent } from './components/continue-learning/continue-learning.component';
import { FeaturesListComponent } from './components/features-list/features-list.component';
import { InterestRecommendationComponent } from './components/interest-recommendation/interest-recommendation.component';
import { LatestComponent } from './components/latest/latest.component';
import { PlaygroundComponent } from './components/playground/playground.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { TrendingComponent } from './components/trending/trending.component';
import { UsageRecommendationComponent } from './components/usage-recommendation/usage-recommendation.component';
import { InfyFoundationPathfindersComponent } from './components/infy-foundation-pathfinders/infy-foundation-pathfinders.component';

@NgModule({
  declarations: [
    CertificationComponent,
    ContinueLearningComponent,
    FeaturesListComponent,
    InterestRecommendationComponent,
    LatestComponent,
    PlaygroundComponent,
    PlaylistComponent,
    RecommendationsComponent,
    TrendingComponent,
    UsageRecommendationComponent,
    CoursesForYouComponent,
    InfyFoundationPathfindersComponent
  ],
  exports: [
    CertificationComponent,
    ContinueLearningComponent,
    FeaturesListComponent,
    InterestRecommendationComponent,
    LatestComponent,
    PlaygroundComponent,
    PlaylistComponent,
    RecommendationsComponent,
    TrendingComponent,
    UsageRecommendationComponent,
    CoursesForYouComponent,
    InfyFoundationPathfindersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    CarouselModule,
    MatDividerModule,
    SearchStripModule,
    ScrollHandlerModule,
    ContentStripModule,
    CustomDirectivesModule,
    SpinnerModule
  ]
})
export class ContentWidgetsModule { }
