/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AceEditorModule } from 'ng2-ace-editor'
import { MatQuillComponent } from './components/rich-text-editor/my-own.component'
import { SharedModule } from '@ws/author/src/lib/modules/shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PlainCKEditorComponent } from './components/plain-ckeditor/plain-ckeditor.component'
import { EditMetaComponent } from './components/edit-meta/edit-meta.component'
import { UploadService } from './services/upload.service'
import { QuillComponent } from './components/rich-text-editor/quill.component'
import { DragDropDirective } from './directives/drag-drop.directive'
import { CKEditorModule } from 'ng2-ckeditor'
import { AceEditorComponent } from './components/ace-editor/ace-editor.component'
import { CatalogSelectModule } from '../shared/components/catalog-select/catalog-select.module'
import { SkillsSelectModule } from './components/skills-select/skills-select.module'

@NgModule({
  declarations: [
    MatQuillComponent,
    QuillComponent,
    PlainCKEditorComponent,
    EditMetaComponent,
    DragDropDirective,
    AceEditorComponent,
  ],
  imports: [
    CommonModule,
    CKEditorModule,
    SharedModule,
    AceEditorModule,
    CatalogSelectModule,
    SkillsSelectModule,
  ],
  exports: [
    MatQuillComponent,
    QuillComponent,
    PlainCKEditorComponent,
    EditMetaComponent,
    DragDropDirective,
    AceEditorComponent,
  ],
  providers: [
    UploadService,
  ],
})
export class EditorSharedModule { }
