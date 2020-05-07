/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatRadioModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatChipsModule
} from '@angular/material';

import { TrainingModule } from '../../modules/training/training.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { ActionBottomSheetModule } from '../../modules/action-bottom-sheet/action-bottom-sheet.module';
import { ActionBtnModule } from '../../modules/action-btn/action-btn.module';
import { ProgressModule } from '../../modules/progress/progress.module';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { DiscussionForumModule } from '../../modules/discussion-forum/discussion-forum.module';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { TocRoutingModule } from './toc-routing.module';
import { DialogAmpVideoModule } from '../../modules/dialog-amp-video/dialog-amp-video.module';

// comps
import { AboutComponent } from './components/about/about.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { CohortsComponent } from './components/cohorts/cohorts.component';
import { DiscussionForumComponent } from './components/discussion-forum/discussion-forum.component';
import { HtmlInstructionsComponent } from './components/html-instructions/html-instructions.component';
import { PartOfComponent } from './components/part-of/part-of.component';
import { PostLearnComponent } from './components/post-learn/post-learn.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { TocCardComponent } from './components/toc-card/toc-card.component';
import { TocContentListComponent } from './components/toc-content-list/toc-content-list.component';
import { TocComponent } from './components/toc/toc.component';
import { CertificationComponent } from './components/certification/certification.component';
import { CertificationTocModule } from '../../modules/certification-toc/certification-toc.module';
import { ResultUploadComponent } from './routes/certification-toc/components/result-upload/result-upload.component';
import { TrainingProgramDemoModule } from '../../modules/training-program-demo/training-program-demo.module';
import { MaterialsComponent } from './components/materials/materials.component';

@NgModule({
  declarations: [
    AboutComponent,
    TocCardComponent,
    CohortsComponent,
    AnalyticsComponent,
    ProjectsComponent,
    DiscussionForumComponent,
    PostLearnComponent,
    PartOfComponent,
    HtmlInstructionsComponent,
    TocContentListComponent,
    TocComponent,
    CertificationComponent,
    ResultUploadComponent,
    MaterialsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TocRoutingModule,
    ActionBtnModule,
    ActionBottomSheetModule,
    UtilityModule,
    CustomDirectivesModule,
    ProgressModule,
    SpinnerModule,
    ContentStripModule,
    ScrollHandlerModule,
    TrainingModule,
    DiscussionForumModule,
    DialogAmpVideoModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatGridListModule,
    MatExpansionModule,
    MatTabsModule,
    MatMenuModule,
    MatRadioModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatChipsModule,
    CertificationTocModule,
    // FOR SIEMENS DEMO
    TrainingProgramDemoModule
  ]
})
export class TocModule {}
