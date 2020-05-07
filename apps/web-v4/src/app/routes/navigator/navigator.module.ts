/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigatorRoutingModule } from './navigator-routing.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import {
  MatButtonModule,
  MatCardModule,
  MatListModule,
  MatRadioModule,
  MatSnackBarModule,
  MatChipsModule,
  MatTabsModule,
  MatInputModule,
  MatDialogModule,
  MatTooltipModule,
  MatTreeModule
} from '@angular/material';


import { NavigatorComponent } from './components/navigator/navigator.component';
import { CarouselModule } from '../../modules/carousel/carousel.module';
import { FeatureCardComponent } from './components/feature-card/feature-card.component';
import { RolesComponent } from './components/roles/roles.component';
import { ExploreComponent } from './components/explore/explore.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { BannerFullstackComponent } from './components/banner-fullstack/banner-fullstack.component';
import { BannerPentagonComponent } from './components/banner-pentagon/banner-pentagon.component';
import { CertificationPanelComponent } from './components/certification-panel/certification-panel.component';
import { CohortLearningComponent } from './components/cohort-learning/cohort-learning.component';
import { CourseCardComponent } from './components/course-card/course-card.component';
import { DeliveryPartnerComponent } from './components/delivery-partner/delivery-partner.component';
import { FsCardComponent } from './components/fs-card/fs-card.component';
import { FullstackProgramComponent } from './components/fullstack-program/fullstack-program.component';
import { IndustriesComponent } from './components/industries/industries.component';
import { KnowmoreCardComponent } from './components/knowmore-card/knowmore-card.component';
import { LearningPathComponent } from './components/learning-path/learning-path.component';
import { LpDurationBarComponent } from './components/lp-duration-bar/lp-duration-bar.component';
import { RoleComponent } from './components/role/role.component';
import { SalesCompetenciesComponent } from './components/sales-competencies/sales-competencies.component';
import { SalesHomeComponent } from './components/sales-home/sales-home.component';
import { SalesLaunchpadComponent } from './components/sales-launchpad/sales-launchpad.component';
import { SalesOnboardingComponent } from './components/sales-onboarding/sales-onboarding.component';
import { SuccessStoriesComponent } from './components/success-stories/success-stories.component';
import { SuggestedLpComponent } from './components/suggested-lp/suggested-lp.component';
import { RoleCardComponent } from './components/role-card/role-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PentagonModule } from '../../modules/pentagon/pentagon.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { ScrollHandlerModule } from '../../modules/scroll-handler/scroll-handler.module';
import { ContentStripModule } from '../../modules/content-strip/content-strip.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { MutlilineSnackbarComponentComponent } from './components/mutliline-snackbar-component/mutliline-snackbar-component.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { SearchStripModule } from '../../modules/search-strip/search-strip.module';
import { DiaryComponent } from './components/diary/diary.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { CandidateDevelopmentPlanComponent } from './components/candidate-development-plan/candidate-development-plan.component';
import { SkillCardComponent } from './components/skill-card/skill-card.component';
import { CdpLearningPathComponent } from './components/cdp-learning-path/cdp-learning-path.component';
import { NewCdpComponent } from './components/new-cdp/new-cdp.component';

@NgModule({
  declarations: [
    NavigatorComponent,
    FeatureCardComponent,
    RolesComponent,
    ExploreComponent,
    SuggestionsComponent,
    AccountsComponent,
    BannerFullstackComponent,
    BannerPentagonComponent,
    CertificationPanelComponent,
    CohortLearningComponent,
    CourseCardComponent,
    DeliveryPartnerComponent,
    FsCardComponent,
    FullstackProgramComponent,
    IndustriesComponent,
    KnowmoreCardComponent,
    LearningPathComponent,
    LpDurationBarComponent,
    RoleComponent,
    SalesCompetenciesComponent,
    SalesHomeComponent,
    SalesLaunchpadComponent,
    SalesOnboardingComponent,
    SuccessStoriesComponent,
    SuggestedLpComponent,
    RoleCardComponent,
    MutlilineSnackbarComponentComponent,
    DiaryComponent,
    ComingSoonComponent,
    CandidateDevelopmentPlanComponent,
    SkillCardComponent,
    CdpLearningPathComponent,
    NewCdpComponent,
  ],
  entryComponents: [
    MutlilineSnackbarComponentComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NavigatorRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatTreeModule,
    MatTooltipModule,
    MatRadioModule,
    MatSnackBarModule,
    MatInputModule,
    MatRadioModule,
    MatIconModule,
    MatChipsModule,
    CarouselModule,
    UtilityModule,
    PentagonModule,
    ScrollHandlerModule,
    ContentStripModule,
    SpinnerModule,
    CustomDirectivesModule,
    SearchStripModule
  ],
})
export class NavigatorModule { }
