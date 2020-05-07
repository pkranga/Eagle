/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { CreateComponent } from './routing/modules/create/components/create/create.component'
import { AuthHomeComponent } from './routing/modules/home/components/home/home.component'
import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { AuthRootComponent } from './components/root/root.component'
import { ContentTOCResolver } from './services/content-resolve.service'
import { OrdinalsResolver } from './modules/shared/services/ordianls.resolver.service'
import { ViewerComponent } from './routing/components/viewer/viewer.component'
import { ContentAndDataReadMultiLangTOCResolver } from './services/content-and-data-read-multi-lang.service'
import { InitResolver } from './services/init-resolve.service'
import { GeneralGuard } from '../../../../../src/app/guards/general.guard'

const routes: Routes = [
  {
    path: 'home',
    component: AuthHomeComponent,
  },
  {
    path: 'editor',
    loadChildren: () => import('./routing/modules/editor/editor.module').then(u => u.EditorModule),
    resolve: {
      script: InitResolver,
    },
  },
  {
    path: 'editor/:id',
    loadChildren: () => import('./routing/modules/editor/editor.module').then(u => u.EditorModule),
    resolve: {
      contents: ContentAndDataReadMultiLangTOCResolver,
      script: InitResolver,
    },
  },
  {
    path: 'my-content',
    loadChildren: () => import('./routing/modules/my-content/my-content.module').then(u => u.MyContentdModule),
    resolve: {
      ordinals: OrdinalsResolver,
    },
  },
  {
    path: 'create',
    data: {
      requiredRoles: ['content-creator', 'kb-curator', 'kb-creator', 'channel-creator', 'editor', 'admin'],
    },
    canActivate: [GeneralGuard],
    component: CreateComponent,
    resolve: {
      ordinals: OrdinalsResolver,
    },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'viewer/:id',
    component: ViewerComponent,
    resolve: {
      content: ContentTOCResolver,
    },
  },
]

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: AuthRootComponent,
        children: routes,
      },
    ]),
  ],
  exports: [RouterModule],
})
export class WsAuthorRootRoutingModule { }
