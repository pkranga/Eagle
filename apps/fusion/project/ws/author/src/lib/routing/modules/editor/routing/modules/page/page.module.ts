/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { BreadcrumComponent } from './components/breadcrum/breadcrum.component'
import { WidgetResolverModule } from '@ws-widget/resolver'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { PageComponent } from './components/page/page.component'
import { SharedModule } from '@ws/author/src/lib/modules/shared/shared.module'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { PageRoutingModule } from './page-routing.module'
import { MediaComponent } from './components/media/media.component'
import { HtmlComponent } from './components/html/html.component'
import { EmbedComponent } from './components/embed/embed.component'
import { SliderComponent } from './components/slider/slider.component'
import { WidgetEditorBaseComponent } from './interface/component'
import { EditorSharedModule } from '../../../shared/shared.module'
import { ButtonsComponent } from './components/buttons/buttons.component'

@NgModule({
  declarations: [
    WidgetEditorBaseComponent,
    PageComponent,
    MediaComponent,
    HtmlComponent,
    EmbedComponent,
    BreadcrumComponent,
    SliderComponent,
    ButtonsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    DragDropModule,
    PageRoutingModule,
    WidgetResolverModule,
    EditorSharedModule,
  ],
})
export class PageModule {}
