/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { CreateContentResolverService } from './services/create-content-resolver.service'
import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { OrdinalsResolver } from '@ws/author/src/lib/modules/shared/services/ordianls.resolver.service'
import { EditorComponent } from './components/editor/editor.component'
import { ChannelJSONResolver } from './services/channel.resolver.service'

const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    children: [
      {
        path: 'curate',
        loadChildren: () =>
          import('./routing/modules/curate/curate.module').then(u => u.CurateModule),
        resolve: { ordinals: OrdinalsResolver },
      },
      {
        path: 'kartifact-pa',
        loadChildren: () =>
          import('./routing/modules/knowledge-artifact-pa/knowledge-artifact-pa.module').then(u => u.KnowledgeArtifactPaModule),
        resolve: { ordinals: OrdinalsResolver, content: CreateContentResolverService },
      },
      {
        path: 'channel',
        loadChildren: () =>
          import('./routing/modules/channel/channel.module').then(u => u.ChannelModule),
        resolve: { ordinals: OrdinalsResolver, json: ChannelJSONResolver },
      },
      {
        path: 'page',
        loadChildren: () => import('./routing/modules/page/page.module').then(u => u.PageModule),
        resolve: { ordinals: OrdinalsResolver },
      },
      {
        path: 'upload',
        loadChildren: () =>
          import('./routing/modules/upload/upload.module').then(u => u.UploadModule),
        resolve: { ordinals: OrdinalsResolver },
      },
      {
        path: 'knowledge-board',
        loadChildren: () =>
          import('./routing/modules/knowledge-board/knowledge-board.module').then(
            u => u.KnowledgeBoardModule,
          ),
        resolve: { ordinals: OrdinalsResolver },
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorRoutingModule { }
