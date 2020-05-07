/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { CreateContentResolverService } from './services/create-content-resolver.service'
import { ChannelJSONResolver } from './services/channel.resolver.service'
import { AuthViewerModule } from '@ws/author/src/lib/modules/viewer/viewer.module'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { EditorService } from './services/editor.service'
import { EditorComponent } from './components/editor/editor.component'
import { EditorRoutingModule } from './editor-routing.module'
import { SharedModule } from '@ws/author/src/lib/modules/shared/shared.module'
import { EditorSharedModule } from './shared/shared.module'

@NgModule({
  declarations: [
    EditorComponent,
  ],
  imports: [
    AuthViewerModule,
    CommonModule,
    EditorRoutingModule,
    EditorSharedModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [
    EditorService,
    ChannelJSONResolver,
    CreateContentResolverService,
  ],
})
export class EditorModule { }
