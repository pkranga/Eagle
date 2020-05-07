/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// material imports
import { MatButtonModule, MatCardModule, MatDividerModule, MatIconModule, MatMenuModule, MatTabsModule, MatToolbarModule, MatDialogModule, MatProgressBarModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { CarouselModule } from '../../modules/carousel/carousel.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { AboutComponent } from './components/about/about.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { EventsComponent } from './components/events/events.component';
import { LandingComponent } from './components/landing/landing.component';
import { TrailblazersComponent } from './components/trailblazers/trailblazers.component';
import { TweetsComponent } from './components/tweets/tweets.component';
import { LeadershipRoutingModule } from './leadership-routing.module';
import { LeadershipHomeComponent } from './components/leadership-home/leadership-home.component';
import { SendMailDialogComponent } from './components/send-mail-dialog/send-mail-dialog.component';
import { DiscussComponent } from './components/discuss/discuss.component';
import { DiscussionForumModule } from '../../modules/discussion-forum/discussion-forum.module';
import { CommunicationsComponent } from './components/communications/communications.component';


@NgModule({
  declarations: [AboutComponent, LandingComponent, ArticlesComponent, TrailblazersComponent, EventsComponent, TweetsComponent, LeadershipHomeComponent, SendMailDialogComponent, DiscussComponent, CommunicationsComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LeadershipRoutingModule,
    SearchStripModule,
    CarouselModule,
    SpinnerModule,
    DiscussionForumModule,
    // material imports
    MatInputModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    MatDividerModule,
    MatCardModule,
    MatMenuModule
  ],
  exports: [
    LeadershipHomeComponent
  ],
  entryComponents: [
    SendMailDialogComponent
  ]
})
export class LeadershipModule { }
