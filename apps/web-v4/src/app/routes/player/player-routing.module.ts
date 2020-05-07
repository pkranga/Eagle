/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// guard imports
import { ContentAccessGuard } from '../../guards/content-access.guard';
// resolver imports
import { PlayerResolve } from '../../resolvers/player.resolve';
import { GoalResolve } from '../../resolvers/goal.resolve';
import { KhubResolve } from '../../resolvers/khub.resolve';
import { PlaylistsResolve } from '../../resolvers/playlists.resolve';
import { SocialResolve } from '../../resolvers/social.resolve';
// module imports
// component imports
import { PlayerComponent } from './components/player/player.component';

const CONTENT_CHILD_ROUTES = [
  {
    path: 'audio',
    loadChildren: '../../plugins/audio/audio.module#AudioModule'
  },
  {
    path: 'certification',
    loadChildren: '../../plugins/certification/certification.module#CertificationModule'
  },
  {
    path: 'class-diagram',
    loadChildren: '../../plugins/class-diagram/class-diagram.module#ClassDiagramModule'
  },
  {
    path: 'collection',
    loadChildren: '../../plugins/collection/collection.module#CollectionModule'
  },
  {
    path: 'dnd-quiz',
    loadChildren: '../../plugins/dnd-quiz/dnd-quiz.module#DndQuizModule'
  },
  {
    path: 'hands-on',
    loadChildren: '../../plugins/hands-on/hands-on.module#HandsOnModule'
  },
  {
    path: 'html',
    loadChildren: '../../plugins/html/html.module#HtmlModule'
  },
  {
    path: 'html-picker',
    loadChildren: '../../plugins/html-picker/html-picker.module#HtmlPickerModule'
  },
  {
    path: 'iap',
    loadChildren: '../../plugins/iap/iap.module#IapModule'
  },
  {
    path: 'ilp-fp',
    loadChildren: '../../plugins/ilp-fp/ilp-fp.module#IlpFpModule'
  },
  {
    path: 'interactive-video',
    loadChildren: '../../plugins/interactive-video/interactive-video.module#InteractiveVideoModule'
  },
  {
    path: 'pdf',
    loadChildren: '../../plugins/pdf/pdf.module#PdfModule'
  },
  {
    path: 'quiz',
    loadChildren: '../../plugins/quiz/quiz.module#QuizModule'
  },
  {
    path: 'video',
    loadChildren: '../../plugins/video/video.module#VideoModule'
  },
  {
    path: 'videojs',
    loadChildren: '../../plugins/videojs/videojs.module#VideojsModule'
  },
  {
    path: 'web-module',
    loadChildren: '../../plugins/web-module/web-module.module#WebModuleModule'
  },
  {
    path: 'youtube',
    loadChildren: '../../plugins/youtube/youtube.module#YoutubeModule'
  },
  {
    path: 'error',
    loadChildren: '../../plugins/error/error.module#ErrorModule'
  }
];
const routes: Routes = [
  {
    path: 'content/:resourceId',
    canActivate: [ContentAccessGuard],
    component: PlayerComponent,
    resolve: {
      playerDetails: PlayerResolve
    },
    data: {
      contentAccessKeys: ['resourceId']
    },
    children: CONTENT_CHILD_ROUTES
  },
  {
    path: 'content/:contentId/:resourceId',
    canActivate: [ContentAccessGuard],
    component: PlayerComponent,
    resolve: {
      playerDetails: PlayerResolve
    },
    data: {
      contentAccessKeys: ['contentId', 'resourceId']
    },
    children: CONTENT_CHILD_ROUTES
  },
  {
    path: 'blogs/:resourceId',
    // canActivate: [ContentAccessGuard],
    component: PlayerComponent,
    resolve: {
      playerDetails: SocialResolve
    },
    // data: {
    //   contentAccessKeys: ['resourceId']
    // },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: '../../plugins/blogs/blogs.module#BlogsModule'
      }
    ]
  },
  {
    path: 'q-and-a/:resourceId',
    // canActivate: [ContentAccessGuard],
    component: PlayerComponent,
    resolve: {
      playerDetails: SocialResolve
    },
    // data: {
    //   contentAccessKeys: ['resourceId']
    // },
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: '../../plugins/q-and-a/q-and-a.module#QAndAModule'
      }
    ]
  }
  // {
  //   path: 'goals/:resourceId',
  //   // canActivate: [ContentAccessGuard],
  //   component: PlayerComponent,
  //   resolve: {
  //     playerDetails: GoalResolve
  //   },
  //   // data: {
  //   //   contentAccessKeys: ['resourceId']
  //   // },
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       loadChildren: '../../plugins/goals/goals.module#GoalsModule'
  //     }
  //   ]
  // },
  // {
  //   path: 'playlists/:resourceId',
  //   // canActivate: [ContentAccessGuard],
  //   component: PlayerComponent,
  //   resolve: {
  //     playerDetails: PlaylistsResolve
  //   },
  //   // data: {
  //   //   contentAccessKeys: ['resourceId']
  //   // },
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       loadChildren: '../../plugins/playlists/playlists.module#PlaylistsModule'
  //     }
  //   ]
  // }
  // {
  //   path: 'khub/:itemId',
  //   // canActivate: [ContentAccessGuard],
  //   component: PlayerComponent,
  //   resolve: {
  //     playerDetails: KhubResolve
  //   },
  //   children: [
  //     {
  //       path: '',
  //       pathMatch: 'full',
  //       loadChildren: '../../plugins/khub/khub.module#KhubModule'
  //     }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [PlayerResolve, SocialResolve, GoalResolve, PlaylistsResolve, KhubResolve],
  exports: [RouterModule]
})
export class PlayerRoutingModule {}
