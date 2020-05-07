/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { EditorKartifactComponent } from './components/editor-kartifact/editor-kartifact.component'
import { KnowledgeArtifactPaRoutingModule } from './knowledge-artifact-pa.routing.module'
import { KnowledgeArtifactPaComponent } from './components/knowledge-artifact-pa/knowledge-artifact-pa.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { EditorSharedModule } from '../../../shared/shared.module'
import { SharedModule } from '../../../../../../modules/shared/shared.module'
import { UploadKartifactComponent } from './components/upload-kartifact/upload-kartifact.component'

@NgModule({
  declarations: [
    KnowledgeArtifactPaComponent,
    EditorKartifactComponent,
    UploadKartifactComponent,
  ],
  exports: [
    KnowledgeArtifactPaComponent,
  ],
  imports: [
    CommonModule,
    EditorSharedModule,
    SharedModule,
    KnowledgeArtifactPaRoutingModule,
  ],
})
export class KnowledgeArtifactPaModule { }
