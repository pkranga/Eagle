/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { QandAMaterialModule } from './q-and-a.material-module';
import { QandARoutingModule } from './q-and-a-routing.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { EditorQuillModule } from '../../modules/editor-quill/editor-quill.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { SocialModule } from '../../modules/social/social.module';

import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { QandaHomeComponent } from './components/qanda-home/qanda-home.component';
import { QandaViewComponent } from './components/qanda-view/qanda-view.component';
import { QandaAskComponent } from './components/qanda-ask/qanda-ask.component';
import { QnadaReplyViewComponent } from './components/qnada-reply-view/qnada-reply-view.component';
import { QandaResultsComponent } from './components/qanda-results/qanda-results.component';
import { QandaListItemComponent } from './components/qanda-list-item/qanda-list-item.component';
import { QandaMeComponent } from './components/qanda-me/qanda-me.component';

@NgModule({
  declarations: [
    QandaHomeComponent,
    QandaViewComponent,
    QandaAskComponent,
    SafeHtmlPipe,
    QnadaReplyViewComponent,
    QandaResultsComponent,
    QandaListItemComponent,
    QandaMeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    QandAMaterialModule,
    QandARoutingModule,
    EditorQuillModule,
    ReactiveFormsModule,
    SpinnerModule,
    UtilityModule,
    SocialModule
  ]
})
export class QAndAModule {}
