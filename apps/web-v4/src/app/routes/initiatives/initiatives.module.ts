/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { CarouselModule } from '../../modules/carousel/carousel.module';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { ChangeChampionsComponent } from './components/change-champions/change-champions.component';
import {
  MatTabsModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatCheckboxModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatFormFieldModule,
  MatInputModule,
  MatRadioModule
} from '@angular/material';
import { ChangeStoriesComponent } from './components/change-stories/change-stories.component';
import { InfluenceChangeComponent } from './components/influence-change/influence-change.component';
import { MailNotificationComponent } from './components/mail-notification/mail-notification.component';
import { MarkTheDateComponent } from './components/mark-the-date/mark-the-date.component';
import { OcmHomeComponent } from './components/ocm-home/ocm-home.component';
import { SearchResultsStripComponent } from './components/search-results-strip/search-results-strip.component';
import { SentientProgramsComponent } from './components/sentient-programs/sentient-programs.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { WhatNextComponent } from './components/what-next/what-next.component';
import { InitiativesRoutingModule } from './initiatives-routing.module';

import { AdoptionDashboardComponent } from './components/adoption-dashboard/adoption-dashboard.component';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';
import { AboutComponent } from './components/about/about.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { CoCreateComponent } from './components/co-create/co-create.component';
import { DiscussionForumModule } from '../../modules/discussion-forum/discussion-forum.module';

@NgModule({
  exports: [
    OcmHomeComponent,
    ChangeStoriesComponent,
    ToDoListComponent,
    MailNotificationComponent,
    MarkTheDateComponent,
    InfluenceChangeComponent,
    ChangeChampionsComponent,
    WhatNextComponent,
    SearchResultsStripComponent,
    SentientProgramsComponent,
    AdoptionDashboardComponent
  ],
  declarations: [
    OcmHomeComponent,
    ChangeStoriesComponent,
    ToDoListComponent,
    MailNotificationComponent,
    MarkTheDateComponent,
    InfluenceChangeComponent,
    ChangeChampionsComponent,
    WhatNextComponent,
    SearchResultsStripComponent,
    SentientProgramsComponent,
    AdoptionDashboardComponent,
    AboutComponent,
    FeedbackComponent,
    CoCreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InitiativesRoutingModule,
    ContentStripModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CustomDirectivesModule,
    DiscussionForumModule,
    CarouselModule,
    MatCardModule,
    MatCheckboxModule,
    MatListModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    SearchStripModule,
    SpinnerModule,
    MatTabsModule,
    UtilityModule,
    ScrollHandlerModule
  ],
  providers: [MatDatepickerModule]
})
export class InitiativesModule {}
