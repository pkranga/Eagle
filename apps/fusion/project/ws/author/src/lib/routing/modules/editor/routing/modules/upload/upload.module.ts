/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AuthViewerModule } from '@ws/author/src/lib/modules/viewer/viewer.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { UploadComponent } from './components/upload/upload.component'
import { FileUploadComponent } from './components/file-upload/file-upload.component'
import { SharedModule } from '@ws/author/src/lib/modules/shared/shared.module'
import { EditorSharedModule } from '../../../shared/shared.module'
import { UploadRoutingModule } from './upload-routing.module'

@NgModule({
  declarations: [
    UploadComponent,
    FileUploadComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    EditorSharedModule,
    UploadRoutingModule,
    AuthViewerModule,
  ],
})
export class UploadModule { }
