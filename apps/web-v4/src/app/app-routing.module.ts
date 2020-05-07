/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// components
import { AppsComponent } from './components/apps/apps.component';
// import { BannerWithContentStripsComponent } from './components/banner-with-content-strips/banner-with-content-strips.component';
import { LoginComponent } from './components/login/login.component';
import { EUserRoles } from './constants/enums.constant';
// guards
import { GeneralGuard } from './guards/general.guard';
import { LoginGuard } from './guards/login.guard';
import { EventDetailResolve } from './resolvers/eventDetail.resolve';
import { OnboardingResolve } from './resolvers/onboarding.resolve';
import { TrainingResolve } from './resolvers/training.resolve';
import { SelectivePreloadModulesService } from './services/selective-preload-modules.service';
import { BannerWithContentStripComponent } from './modules/banner-with-content-strip/components/banner-with-content-strip/banner-with-content-strip.component';
import { HomeRedirectionGuard } from './guards/home-redirection.guard';
import { TrainingGuard } from './guards/training.guard';
import { CertificationsGuard } from './guards/certifications.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'apps',
    component: AppsComponent,
    canActivate: [GeneralGuard]
  },
  {
    path: 'tnc',
    loadChildren: './routes/tnc/tnc.module#TncModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { login: false, tnc: false, featureKeys: ['tnc'] }
    }
  },
  {
    path: 'faq',
    loadChildren: './routes/faq/faq.module#FaqModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { login: false, tnc: false, featureKeys: ['faq'] }
    }
  },
  {
    path: 'about',
    loadChildren: './routes/about/about.module#AboutModule',
    data: {
      routeConfig: { login: false, tnc: false }
    }
  },
  {
    path: 'infytq/certification/admin',
    loadChildren: './routes/infytq/infytq.module#InfytqModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { login: true, tnc: true, roles: [EUserRoles.INFTQ_CERTIFICATION_ADMIN] }
    }
  },
  {
    path: 'contact-us',
    loadChildren: './routes/contact/contact.module#ContactModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { login: false, tnc: false, featureKeys: ['contactUs'] }
    }
  },
  {
    path: 'counter',
    loadChildren: './routes/counter/counter.module#CounterModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { login: false, tnc: false, featureKeys: ['counter'] }
    }
  },
  {
    path: 'cmt',
    loadChildren: './routes/cmt/cmt.module#CmtModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['cmt'] }
    }
  },
  {
    path: 'release-notes',
    loadChildren: './routes/release-notes/release-notes.module#ReleaseNotesModule',
    data: {
      routeConfig: { login: false, tnc: false }
    }
  },
  {
    path: 'pages',
    loadChildren: './routes/pages/pages.module#PagesModule',
    // _________ Remember to Remove _____________
    canActivate: [GeneralGuard],
    // _________ Remember to Remove _____________
    data: {
      routeConfig: { featureKeys: ['siemens'] }
    }
  },
  {
    path: 'mobile-app',
    loadChildren: './routes/mobile-apps/mobile-apps.module#MobileAppsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { login: false, tnc: false, featureKeys: ['mobileApps'] }
    }
  },
  {
    path: 'certifications',
    loadChildren: './routes/certification/certification.module#CertificationModule',
    canActivate: [GeneralGuard, CertificationsGuard],
    data: {
      routeConfig: { featureKeys: ['certifications'] }
    }
  },
  {
    path: 'certifications-dashboard',
    loadChildren: './routes/certification-v2/certification-v2.module#CertificationV2Module',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['certifications'] }
    }
  },
  {
    path: 'home',
    loadChildren: './routes/home/home.module#HomeModule',
    canActivate: [GeneralGuard, HomeRedirectionGuard],
    data: {
      preload: true
    }
  },
  {
    path: 'catalog',
    loadChildren: './routes/catalog/catalog.module#CatalogModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['catalog'] }
    }
  },
  {
    path: 'communications',
    loadChildren: './routes/communications/communications.module#CommunicationsModule',
    canActivate: [GeneralGuard],
    data: {}
  },
  {
    path: 'communications/tv',
    canActivate: [GeneralGuard],
    component: BannerWithContentStripComponent,
    data: {
      routeConfig: { featureKeys: ['infyTv'] },
      configKey: 'infyTv'
    }
  },

  {
    path: 'learning-analytics',
    loadChildren: './routes/learning-analytics/learning-analytics.module#LearningAnalyticsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['analytics'],
        roles: [EUserRoles.LEARNING_ANALYTICS]
      }
    }
  },
  {
    path: 'industry-analytics/:tag',
    loadChildren: './routes/industry-analytics/industry-analytics.module#IndustryAnalyticsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['industryAnalytics'],
        roles: [EUserRoles.LEARNING_ANALYTICS]
      }
    }
  },

  {
    path: 'learning-analytics/home',
    loadChildren: './routes/client-analytics/client-analytics.module#ClientAnalyticsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['siemens', 'analytics'],
        roles: [EUserRoles.LEARNING_ANALYTICS]
      }
    }
  },
  {
    path: 'my-skills',
    loadChildren: './routes/skill-quotient/skill-quotient.module#SkillQuotientModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['skillQuotient'],
        roles: [EUserRoles.MY_SKILLS]
      }
    }
  },

  {
    path: 'navigator',
    loadChildren: './routes/navigator/navigator.module#NavigatorModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['navigator'] }
    }
  },
  {
    path: 'events',
    loadChildren: './routes/events/events.module#EventsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['events'] }
    }
  },
  {
    path: 'events/:eventId',
    component: BannerWithContentStripComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['events'] }
    },
    resolve: {
      bannerWithContentStripData: EventDetailResolve
    }
  },
  {
    path: 'practice',
    loadChildren: './routes/practice/practice.module#PracticeModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['practice'], roles: [EUserRoles.IAP] }
    }
  },
  {
    path: 'search',
    loadChildren: './routes/search/search.module#SearchModule',
    canActivate: [GeneralGuard],
    data: { preload: true }
  },
  {
    path: 'searchv2',
    loadChildren: './routes/unified-search/unified-search.module#UnifiedSearchModule'
    // canActivate: [GeneralGuard]
  },
  {
    path: 'viewer',
    // redirectTo: 'player/content'
    loadChildren: './routes/viewer/viewer.module#ViewerModule',
    canActivate: [GeneralGuard],
    data: { preload: true }
  },
  {
    path: 'player',
    redirectTo: 'viewer'
    // loadChildren: './routes/player/player.module#PlayerModule',
    // canActivate: [GeneralGuard]
  },
  {
    path: 'learning-history',
    loadChildren: './routes/learning-history/learning-history.module#LearningHistoryModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['learningHistory'] }
    }
  },
  {
    path: 'goals',
    loadChildren: './routes/goals/goals.module#GoalsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['goals'] }
    }
  },
  {
    path: 'playlist',
    loadChildren: './routes/playlist/playlist.module#PlaylistModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['playlist'] }
    }
  },
  {
    path: 'playground',
    component: BannerWithContentStripComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['playground'] },
      configKey: 'playground'
    }
  },
  {
    path: 'interest',
    loadChildren: './routes/interest/interest.module#InterestModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['interest'] }
    }
  },
  {
    path: 'badges',
    loadChildren: './routes/badges/badges.module#BadgesModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['badges'] }
    }
  },
  {
    path: 'time-spent',
    loadChildren: './routes/time-spent/time-spent.module#TimeSpentModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['learningTime'] }
    }
  },
  {
    path: 'leaderboard',
    loadChildren: './routes/leaderboard/leaderboard.module#LeaderboardModule',
    canActivate: [GeneralGuard]
  },
  {
    path: 'onboarding',
    component: BannerWithContentStripComponent,
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['onboarding'] }
    },
    resolve: {
      bannerWithContentStripData: OnboardingResolve
    }
  },
  {
    path: 'living-labs',
    loadChildren: './routes/living-labs/living-labs.module#LivingLabsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['livingLabs'],
        roles: [EUserRoles.AUTHOR]
      }
    }
  },
  {
    path: 'marketing',
    loadChildren: './routes/marketing/marketing.module#MarketingModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['marketing'] }
    }
  },
  {
    path: 'toc',
    loadChildren: './routes/toc/toc.module#TocModule',
    canActivate: [GeneralGuard],
    data: { preload: true }
  },
  {
    path: 'concept-graph',
    loadChildren: './routes/concept-graph/concept-graph.module#ConceptGraphModule',
    canActivate: [GeneralGuard]
  },
  {
    path: 'feedback',
    loadChildren: './routes/feedback/feedback.module#FeedbackModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['feedback'] }
    }
  },
  {
    path: 'from-leaders',
    loadChildren: './routes/from-leaders/from-leaders.module#FromLeadersModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['fromLeaders'] }
    }
  },
  {
    path: 'notifications',
    loadChildren: './routes/notifications/notifications.module#NotificationsModule',
    canActivate: [GeneralGuard]
  },
  {
    path: 'profile',
    loadChildren: './routes/profile/profile.module#ProfileModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['profile'] }
    }
  },
  {
    path: 'settings',
    loadChildren: './routes/settings/settings.module#SettingsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['settings'] }
    }
  },
  {
    path: 'my-analytics',
    loadChildren: './routes/myanalytics/myanalytics.module#MyanalyticsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['myAnalytics'] }
    }
  },
  {
    path: 'experience-wow',
    loadChildren: './routes/initiatives/initiatives.module#InitiativesModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['navigateChange'],
        roles: [EUserRoles.ENGAGEMENT]
      }
    }
  },
  {
    path: 'channels',
    loadChildren: './routes/channels/channels.module#ChannelsModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['channels']
      }
    }
  },
  {
    path: 'submission',
    loadChildren: './routes/submission/submission.module#SubmissionModule',
    canActivate: [GeneralGuard]
  },
  {
    path: 'qna',
    loadChildren: './routes/q-and-a/q-and-a.module#QAndAModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['qna']
      }
    }
  },
  {
    path: 'blog-post',
    loadChildren: './routes/blog-post/blog-post.module#BlogPostModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['blogPost']
      }
    }
  },
  {
    path: 'khub',
    loadChildren: './routes/khub-go/khub-go.module#KhubGoModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: {
        featureKeys: ['khub'],
        roles: [EUserRoles.KHUB]
      }
    }
  },
  {
    path: 'tour',
    loadChildren: './routes/tour/tour.module#TourModule',
    canActivate: [GeneralGuard]
  },
  {
    path: 'salesleader',
    loadChildren: './routes/lab42/lab42.module#Lab42Module',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['lab42'] }
    }
  },
  {
    path: 'iki',
    loadChildren: './routes/iki/iki.module#IkiModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['iki'] }
    }
  },
  {
    path: 'infy-tv',
    loadChildren: './routes/infy-tv/infy-tv.module#InfyTVModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['infyTv'] },
      configKey: 'infyTv'
    }
  },
  {
    path: 'leadership',
    loadChildren: './routes/leadership/leadership.module#LeadershipModule',
    canActivate: [GeneralGuard]
  },
  {
    path: 'ws-training',
    loadChildren: './routes/training-demo/training-demo.module#TrainingDemoModule',
    canActivate: [GeneralGuard],
    data: {
      routeConfig: { featureKeys: ['learningHub', 'siemens'] }
    }
  },
  {
    path: 'training',
    loadChildren: './routes/instructor-led-training/instructor-led-training.module#InstructorLedTrainingModule',
    canActivate: [GeneralGuard, TrainingGuard],
    data: {
      routeConfig: { featureKeys: ['learningHub'] }
    },
    resolve: [TrainingResolve]
  },
  {
    path: 'skills-role/:role_id',
    loadChildren: './routes/compass-role/compass-role.module#CompassRoleModule',
    canActivate: [GeneralGuard]
    // data: {
    //   routeConfig: { featureKeys: ['skills-role'] }
    // }
  },
  {
    path: 'error',
    loadChildren: './routes/error/error.module#ErrorModule'
  },
  {
    path: '**',
    redirectTo: '/error/page-not-found'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: SelectivePreloadModulesService,
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      relativeLinkResolution: 'corrected',
      urlUpdateStrategy: 'eager'
    })
  ],
  exports: [RouterModule],
  providers: [SelectivePreloadModulesService, EventDetailResolve, OnboardingResolve]
})
export class AppRoutingModule { }
