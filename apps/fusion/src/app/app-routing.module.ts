/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ErrorResolverComponent, PageComponent, PageModule } from '@ws-widget/collection'
import { ExploreDetailResolve, PageResolve } from '@ws-widget/utils'
import { AdminGuard } from '@ws/admin/src/lib/guards/admin.guard'
import { InvalidUserComponent } from './component/invalid-user/invalid-user.component'
import { LoginRootComponent } from './component/login-root/login-root.component'
import { ETopBar } from './constants/topBar.constants'
import { EmptyRouteGuard } from './guards/empty-route.guard'
import { ExternalUrlResolverService } from './guards/external-url-resolver.service'
import { GeneralGuard } from './guards/general.guard'
import { LoginGuard } from './guards/login.guard'
import { FeaturesComponent } from './routes/features/features.component'
import { FeaturesModule } from './routes/features/features.module'
import { MobileAppHomeComponent } from './routes/public/mobile-app/components/mobile-app-home.component'
import { PublicAboutComponent } from './routes/public/public-about/public-about.component'
import { PublicContactComponent } from './routes/public/public-contact/public-contact.component'
import { PublicFaqComponent } from './routes/public/public-faq/public-faq.component'
import { TncComponent } from './routes/tnc/tnc.component'
import { TncAppResolverService } from './services/tnc-app-resolver.service'
import { TncPublicResolverService } from './services/tnc-public-resolver.service'

// 💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥
// Please declare routes in alphabetical order
// 😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [EmptyRouteGuard],
    component: LoginRootComponent,
  },
  {
    path: 'practice/behavioral',
    pathMatch: 'full',
    redirectTo: 'page/embed-behavioural-skills',
  },
  {
    path: 'admin',
    loadChildren: () => import('./routes/route-admin.module').then(u => u.RouteAdminModule),
    canActivate: [GeneralGuard, AdminGuard],
  },
  {
    path: 'analytics',
    loadChildren: () => import('./routes/route-analytics.module').then(u => u.RouteAnalyticsModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/channels',
    loadChildren: () => import('./routes/route-channels.module').then(u => u.RouteChannelsModule),
  },
  {
    path: 'app/concept-graph',
    loadChildren: () =>
      import('./routes/route-concept-graph.module').then(u => u.RouteConceptGraphModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/setup',
    loadChildren: () => import('./routes/route-app-setup.module').then(u => u.RouteAppSetupModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/feedback',
    loadChildren: () =>
      import('./routes/route-feedback-v2.module').then(u => u.RouteFeedbackV2Module),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/features',
    component: FeaturesComponent,
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/goals',
    loadChildren: () => import('./routes/route-goals-app.module').then(u => u.RouteGoalsAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/infy',
    loadChildren: () => import('./routes/route-infy-app.module').then(u => u.RouteInfyAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/info',
    loadChildren: () => import('./routes/route-info-app.module').then(u => u.RouteInfoAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/invalid-user',
    component: InvalidUserComponent,
    data: {
      pageType: 'feature',
      pageKey: 'invalid-user',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'app/knowledge-board',
    loadChildren: () =>
      import('./routes/route-knowledge-board.module').then(u => u.RouteKnowledgeBoardModule),
  },
  {
    path: 'app/leaderboard',
    loadChildren: () =>
      import('./routes/route-leaderboard-app.module').then(u => u.RouteLeaderboardAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/notifications',
    loadChildren: () =>
      import('./routes/route-notification-app.module').then(u => u.RouteNotificationAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/playlist',
    loadChildren: () =>
      import('./routes/route-playlist-app.module').then(u => u.RoutePlaylistAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/profile',
    loadChildren: () =>
      import('./routes/route-profile-app.module').then(u => u.RouteProfileAppModule),
    canActivate: [GeneralGuard],
  },

  {
    path: 'app/account-settings',
    loadChildren: () =>
      import('./routes/route-account-settings.module').then(u => u.RouteAccountSettingsModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/search',
    loadChildren: () =>
      import('./routes/route-search-app.module').then(u => u.RouteSearchAppModule),
    data: {
      pageType: 'feature',
      pageKey: 'search',
    },
    resolve: {
      searchPageData: PageResolve,
    },
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/social',
    loadChildren: () =>
      import('./routes/route-social-app.module').then(u => u.RouteSocialAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/toc',
    loadChildren: () => import('./routes/route-app-toc.module').then(u => u.RouteAppTocModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'app/tnc',
    component: TncComponent,
    resolve: {
      tnc: TncAppResolverService,
    },
  },
  {
    path: 'author',
    data: {
      requiredRoles: [
        'content-creator', 'ka-creator', 'kb-curator', 'kb-creator',
        'channel-creator', 'reviewer', 'publisher', 'editor', 'admin',
      ],
    },
    canActivate: [GeneralGuard],
    loadChildren: () =>
      import('./routes/route-authoring-app.module').then(u => u.AuthoringAppModule),
  },
  {
    path: 'error-access-forbidden',
    component: ErrorResolverComponent,
    data: {
      errorType: 'accessForbidden',
    },
  },
  {
    path: 'error-content-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'contentUnavailable',
    },
  },
  {
    path: 'error-feature-disabled',
    component: ErrorResolverComponent,
    data: {
      errorType: 'featureDisabled',
    },
  },
  {
    path: 'error-feature-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'featureUnavailable',
    },
  },
  {
    path: 'error-internal-server',
    component: ErrorResolverComponent,
    data: {
      errorType: 'internalServer',
    },
  },
  {
    path: 'error-service-unavailable',
    component: ErrorResolverComponent,
    data: {
      errorType: 'serviceUnavailable',
    },
  },
  {
    path: 'error-somethings-wrong',
    component: ErrorResolverComponent,
    data: {
      errorType: 'somethingsWrong',
    },
  },
  {
    path: 'externalRedirect',
    canActivate: [ExternalUrlResolverService],
    component: ErrorResolverComponent,
  },
  {
    path: 'learning-hub',
    loadChildren: () =>
      import('./routes/route-learning-hub-app.module').then(u => u.LearningHubAppModule),
    canActivate: [GeneralGuard],
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    component: LoginRootComponent,
    data: {
      pageType: 'feature',
      pageKey: 'login',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'page/:id',
    component: PageComponent,
    data: {
      pageType: 'page',
      pageKey: 'id',
    },
    resolve: {
      pageData: PageResolve,
    },
    canActivate: [GeneralGuard],
  },
  {
    path: 'page/explore/:tags',
    data: {
      pageType: 'page',
      pageKey: 'catalog-details',
    },
    resolve: {
      pageData: ExploreDetailResolve,
    },
    component: PageComponent,
    canActivate: [GeneralGuard],
  },
  {
    path: 'page-leaders',
    loadChildren: () =>
      import('./routes/page-leader-renderer/page-leader-renderer.module').then(
        u => u.PageLeaderRendererModule,
      ),
    canActivate: [GeneralGuard],
  },
  {
    path: 'public/about',
    component: PublicAboutComponent,
    data: {
      pageType: 'feature',
      pageKey: 'about',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/contact',
    component: PublicContactComponent,
    data: {
      pageType: 'feature',
      pageKey: 'public-faq',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/mobile-app',
    component: MobileAppHomeComponent,
    data: {
      pageType: 'feature',
      pageKey: 'mobile-app',
    },
    resolve: {
      pageData: PageResolve,
    },
  },
  {
    path: 'public/tnc',
    component: TncComponent,
    data: {
      isPublic: true,
    },
    resolve: {
      tnc: TncPublicResolverService,
    },
  },
  {
    path: 'public/faq/:tab',
    component: PublicFaqComponent,
  },
  {
    path: 'viewer',
    data: {
      topBar: ETopBar.NONE,
    },
    loadChildren: () => import('./routes/route-viewer.module').then(u => u.RouteViewerModule),
    canActivate: [GeneralGuard],
  },
  // adding here as temp routes did not work
  {
    path: 'practice/behavioral',
    pathMatch: 'full',
    redirectTo: 'page/embed-behavioural-skills',
  }, {
    path: 'practice/hands-on/code-crack',
    pathMatch: 'full',
    redirectTo: 'page/embed-code-crack',
  },
  {
    path: 'practice/hands-on/puzzle-mania',
    pathMatch: 'full',
    redirectTo: 'page/embed-puzzle-mania',
  }, {
    path: 'interview',
    pathMatch: 'full',
    redirectTo: 'page/embed-interview',
  },
  {
    path: 'dialogue',
    pathMatch: 'full',
    redirectTo: 'page/embed-dialogue',
  },
  {
    path: 'etastrategymap',
    pathMatch: 'full',
    redirectTo: 'page/embed-strategy-map',
  },
  {
    path: 'virtualclassroom',
    pathMatch: 'full',
    redirectTo: 'page/embed-virtual-classroom',
  },
  {
    path: 'projectstack',
    pathMatch: 'full',
    redirectTo: 'page/embed-project-stack',
  },
  {
    path: 'livetranscribe',
    pathMatch: 'full',
    redirectTo: 'page/embed-live-transcribe',
  },
  {
    path: 'epoch',
    pathMatch: 'full',
    redirectTo: 'page/embed-epoch',
  },
  {
    path: 'salesleader',
    pathMatch: 'full',
    redirectTo: 'page/embed-sales-leader',
  },
  {
    path: 'maq',
    pathMatch: 'full',
    redirectTo: 'page/embed-maq',
  },
  {
    path: 'ilipdp',
    pathMatch: 'full',
    redirectTo: 'page/embed-ilipdp',
  },
  {
    path: 'practice/home',
    pathMatch: 'full',
    redirectTo: 'page/embed-iap-home',
  },
  {
    path: 'collective',
    pathMatch: 'full',
    redirectTo: 'page/embed-collective',
  },
  {
    path: '**',
    component: ErrorResolverComponent,
    data: {
      errorType: 'notFound',
    },
  },
]

// Temporary routes for application. Please remove from 01st January, 2020
// 💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥💥😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵😵
const tempRoutes: Routes = [
  {
    path: 'practice/behavioral',
    pathMatch: 'full',
    redirectTo: 'page/embed-behavioural-skills',
  }, {
    path: 'practice/hands-on/code-crack',
    pathMatch: 'full',
    redirectTo: 'page/embed-code-crack',
  },
  {
    path: 'practice/hands-on/puzzle-mania',
    pathMatch: 'full',
    redirectTo: 'page/embed-puzzle-mania',
  }, {
    path: 'interview',
    pathMatch: 'full',
    redirectTo: 'page/embed-interview',
  },
  {
    path: 'dialogue',
    pathMatch: 'full',
    redirectTo: 'page/embed-dialogue',
  },
  {
    path: 'etastrategymap',
    pathMatch: 'full',
    redirectTo: 'page/embed-strategy-map',
  },
  {
    path: 'virtualclassroom',
    pathMatch: 'full',
    redirectTo: 'embed-virtual-classroom',
  },
  {
    path: 'projectstack',
    pathMatch: 'full',
    redirectTo: 'page/embed-project-stack',
  },
  {
    path: 'livetranscribe',
    pathMatch: 'full',
    redirectTo: 'page/embed-live-transcribe',
  },
  {
    path: 'epoch',
    pathMatch: 'full',
    redirectTo: 'page/embed-epoch',
  },
  {
    path: 'salesleader',
    pathMatch: 'full',
    redirectTo: 'page/embed-sales-leader',
  },
  {
    path: 'maq',
    pathMatch: 'full',
    redirectTo: 'page/embed-maq',
  },
  {
    path: 'ilipdp',
    pathMatch: 'full',
    redirectTo: 'page/embed-ilipdp',
  },
  {
    path: 'practice/home',
    pathMatch: 'full',
    redirectTo: 'page/embed-iap-home',
  },
  {
    path: 'toc/:id',
    redirectTo: 'app/toc/:id/overview',
  },
]
@NgModule({
  imports: [
    PageModule,
    FeaturesModule,
    RouterModule.forRoot([...tempRoutes, ...routes], {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'top',
      urlUpdateStrategy: 'eager',
    }),
  ],
  exports: [RouterModule],
  providers: [ExploreDetailResolve],
})
export class AppRoutingModule { }
