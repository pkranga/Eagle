/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { RolesComponent } from './components/roles/roles.component';
import { ExploreComponent } from './components/explore/explore.component';
import { SuggestionsComponent } from './components/suggestions/suggestions.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { DeliveryPartnerComponent } from './components/delivery-partner/delivery-partner.component';
import { RoleComponent } from './components/role/role.component';
import { SuggestedLpComponent } from './components/suggested-lp/suggested-lp.component';
import { SalesHomeComponent } from './components/sales-home/sales-home.component';
import { SalesOnboardingComponent } from './components/sales-onboarding/sales-onboarding.component';
import { SalesCompetenciesComponent } from './components/sales-competencies/sales-competencies.component';
import { SalesLaunchpadComponent } from './components/sales-launchpad/sales-launchpad.component';
import { CohortLearningComponent } from './components/cohort-learning/cohort-learning.component';
import { SuccessStoriesComponent } from './components/success-stories/success-stories.component';
import { LearningPathComponent } from './components/learning-path/learning-path.component';
import { BannerPentagonComponent } from './components/banner-pentagon/banner-pentagon.component';
import { BannerFullstackComponent } from './components/banner-fullstack/banner-fullstack.component';
import { FullstackProgramComponent } from './components/fullstack-program/fullstack-program.component';
import { IndustriesComponent } from './components/industries/industries.component';
import { SuggestedLpResolve } from '../../resolvers/suggested-lp.resolve';
import { DiaryComponent } from './components/diary/diary.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { GeneralGuard } from '../../guards/general.guard';
import { CandidateDevelopmentPlanComponent } from './components/candidate-development-plan/candidate-development-plan.component';
import { CdpLearningPathComponent } from './components/cdp-learning-path/cdp-learning-path.component';
import { NewCdpComponent } from './components/new-cdp/new-cdp.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: NavigatorComponent
  },
  {
    path: 'accounts',
    component: AccountsComponent
  },
  {
    path: 'accounts/:tab',
    component: AccountsComponent
  },
  {
    path: 'infyDiaries',
    component: DiaryComponent
  },
  {
    path: 'dpn',
    component: DeliveryPartnerComponent
  },
  {
    path: 'cdp',
    component: CandidateDevelopmentPlanComponent
  },
  {
    path: 'cdp/:id',
    component: CdpLearningPathComponent
  },
  {
    path: 'new-cdp/:id',
    component: NewCdpComponent
  },
  {
    path: 'dpn/:id',
    component: DeliveryPartnerComponent
  },
  {
    path: 'roles',
    component: RolesComponent
  },
  {
    path: 'role/:id',
    component: RoleComponent
  },
  {
    path: 'explore',
    component: ExploreComponent
  },
  {
    path: 'suggestions',
    component: SuggestionsComponent
  },
  {
    path: 'suggestions/lp',
    component: SuggestedLpComponent,
    resolve: {
      lpdata: SuggestedLpResolve
    }
  },
  {
    path: 'industries',
    component: IndustriesComponent
  },
  {
    path: 'industries/:tab',
    component: IndustriesComponent
  },
  {
    path: 'sales/home',
    component: SalesHomeComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        roles: ['sales']
      }
    }
  },
  {
    path: 'sales/onboarding',
    component: SalesOnboardingComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        roles: ['sales']
      }
    }
  },
  {
    path: 'sales/competencies',
    component: SalesCompetenciesComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        roles: ['sales']
      }
    }
  },
  {
    path: 'sales/launchpad',
    component: SalesLaunchpadComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        roles: ['sales']
      }
    }
  },
  {
    path: 'sales/cohort',
    component: CohortLearningComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        roles: ['sales']
      }
    }
  },
  {
    path: 'sales/stories',
    component: SuccessStoriesComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        roles: ['sales']
      }
    }
  },
  {
    path: 'lp/:id',
    component: LearningPathComponent
  },
  {
    path: 'pillars',
    component: BannerPentagonComponent
  },
  {
    path: 'fullstack',
    component: BannerFullstackComponent
  },
  {
    path: 'fullstack/program/:id',
    component: FullstackProgramComponent
  },
  {
    path: 'coming-soon',
    component: ComingSoonComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [SuggestedLpResolve],
  exports: [RouterModule]
})
export class NavigatorRoutingModule { }
