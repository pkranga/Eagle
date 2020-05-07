/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QuillModule } from 'ngx-quill';

import { EditorQuillComponent } from './components/editor-quill/editor-quill.component';

const SUPPORTED_FORMATS = [
  'background',
  'bold',
  'color',
  'font',
  'code',
  'italic',
  'link',
  'size',
  'strike',
  'script',
  'underline',
  'blockquote',
  'header',
  'indent',
  'list',
  'align',
  'direction',
  'code-block'
];

@NgModule({
  declarations: [EditorQuillComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      formats: SUPPORTED_FORMATS,
      modules: {
        toolbar: [
          ['blockquote', 'code-block'],
          ['bold', 'italic', 'underline', 'link']
        ],
        history: {
          delay: 1500,
          userOnly: true
        },
        syntax: false
      },
      placeholder: 'Compose your text',
      theme: 'bubble'
    })
  ],
  exports: [EditorQuillComponent]
})
export class EditorQuillModule {}
