/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { CertificationsGuard } from './routes/certification-dashboard/guards/certifications.guard'

const routes: Routes = [
  {
    path: 'training',
    loadChildren: () => import('./routes/training/training.module').then(u => u.TrainingModule),
  },
  {
    path: 'certification-dashboard',
    loadChildren: () =>
      import('./routes/certification-dashboard/certification-dashboard.module').then(
        u => u.CertificationDashboardModule,
      ),
    canActivate: [CertificationsGuard],
    data: {
      requiredFeatures: ['certificationLHub'],
    },
  },
  {
    path: 'navigator',
    loadChildren: () => import('./routes/navigator/navigator.module').then(u => u.NavigatorModule),
  },
  {
    path: 'experience-wow',
    loadChildren: () => import('./routes/ocm/ocm.module').then(u => u.OcmModule),
  },
  {
    path: 'khub',
    loadChildren: () =>
      import('./routes/knowledge-hub/knowledge-hub.module').then(u => u.KnowledgeHubModule),
  },
  {
    path: 'marketing',
    loadChildren: () => import('./routes/marketing/marketing.module').then(u => u.MarketingModule),
  },
  {
    path: 'channels',
    loadChildren: () => import('./routes/channels/channels.module').then(u => u.ChannelsModule),
  },
  {
    path: 'events',
    loadChildren: () => import('./routes/events/events.module').then(u => u.EventsModule),
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InfyRoutingModule {}
