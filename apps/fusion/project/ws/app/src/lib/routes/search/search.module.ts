/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SearchRoutingModule } from './search-routing.module'
import { SearchRootComponent } from './routes/search-root/search-root.component'
import {
  BtnPageBackModule,
  BtnContentDownloadModule,
  BtnContentLikeModule,
  BtnContentShareModule,
  BtnPlaylistModule,
  BtnGoalsModule,
  BtnContentMailMeModule,
  DisplayContentTypeModule,
  PipeContentRouteModule,
  BtnKbModule,
  BtnChannelAnalyticsModule,
} from '@ws-widget/collection'
import {
  MatToolbarModule,
  MatTabsModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatOptionModule,
  MatIconModule,
  MatMenuModule,
  MatChipsModule,
  MatCardModule,
  MatExpansionModule,
  MatCheckboxModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatSidenavModule,
  MatTooltipModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatRippleModule,
} from '@angular/material'
import { SearchInputComponent } from './components/search-input/search-input.component'
import { LearningComponent } from './routes/learning/learning.component'
import { BlogsCardComponent } from './components/blogs-card/blogs-card.component'
import { FilterDisplayComponent } from './components/filter-display/filter-display.component'
import { ItemTileComponent } from './components/item-tile/item-tile.component'
import { KnowledgeComponent } from './routes/knowledge/knowledge.component'
import { LearningCardComponent } from './components/learning-card/learning-card.component'
import { ProjectComponent } from './routes/project/project.component'
import { QandaCardComponent } from './components/qanda-card/qanda-card.component'
import { SocialComponent } from './routes/social/social.component'
import {
  DefaultThumbnailModule,
  PipeLimitToModule,
  PipeDurationTransformModule,
  HorizontalScrollerModule,
} from '@ws-widget/utils/src/public-api'
import { WidgetResolverModule } from '@ws-widget/resolver'
import { HomeComponent } from './routes/home/home.component'
import { TrainingApiService } from '../infy/routes/training/apis/training-api.service'
import { TrainingService } from '../infy/routes/training/services/training.service'
@NgModule({
  declarations: [
    SearchRootComponent,
    SearchInputComponent,
    LearningComponent,
    BlogsCardComponent,
    FilterDisplayComponent,
    ItemTileComponent,
    KnowledgeComponent,
    LearningCardComponent,
    ProjectComponent,
    QandaCardComponent,
    SocialComponent,
    HomeComponent,
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    BtnPageBackModule,
    MatToolbarModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatCardModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatRippleModule,
    DefaultThumbnailModule,
    MatTooltipModule,
    PipeContentRouteModule,
    PipeLimitToModule,
    PipeDurationTransformModule,
    BtnContentDownloadModule,
    BtnContentLikeModule,
    BtnContentShareModule,
    BtnPlaylistModule,
    BtnGoalsModule,
    BtnContentMailMeModule,
    HorizontalScrollerModule,
    MatProgressSpinnerModule,
    DisplayContentTypeModule,
    WidgetResolverModule,
    BtnKbModule,
    BtnChannelAnalyticsModule,
  ],
  exports: [ItemTileComponent, SearchInputComponent],
  providers: [TrainingApiService, TrainingService],
})
export class SearchModule { }
