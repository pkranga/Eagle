/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// user modules
import { ViewerRoutingModule } from './viewer-routing.module';
import { PluginHandsOnModule } from '../../modules/plugin-hands-on/plugin-hands-on.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { ActionBtnModule } from '../../modules/action-btn/action-btn.module';
import { ElementFullscreenModule } from '../../modules/element-fullscreen/element-fullscreen.module';
import { PluginClassDiagramModule } from '../../modules/plugin-class-diagram/plugin-class-diagram.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { PluginQuizModule } from '../../modules/plugin-quiz/plugin-quiz.module';
import { PluginDndQuizModule } from '../../modules/plugin-dnd-quiz/plugin-dnd-quiz.module';
import { PluginHtmlPickerModule } from '../../modules/plugin-html-picker/plugin-html-picker.module';
import { InteractiveVideoModule } from '../../modules/interactive-video/interactive-video.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatTreeModule, MatDialogModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';

// components
import { ViewerComponent } from './components/viewer/viewer.component';
import { IlpFpComponent } from './components/ilp-fp/ilp-fp.component';
import { HtmlComponent } from './components/html/html.component';
import { IapComponent } from './components/iap/iap.component';
import { AudioComponent } from './components/audio/audio.component';
import { VideoComponent } from './components/video/video.component';
import { PdfComponent } from './components/pdf/pdf.component';
import { PartOfComponent } from './components/part-of/part-of.component';
import { ViewerTocComponent } from './components/viewer-toc/viewer-toc.component';
import { YoutubeComponent } from './components/youtube/youtube.component';
import { WebModuleComponent } from './components/web-module/web-module.component';
import { CertificationComponent } from './components/certification/certification.component';
import { CollectionComponent } from './components/collection/collection.component';
import { TextModalComponent } from './components/text-modal/text-modal.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';
import { VideojsComponent } from './components/videojs/videojs.component';
import { RdbmsHandsonModule } from '../../modules/rdbms-handson/rdbms-handson.module';
import { CertificationService } from '../../services/certification.service';
import { CertificationApiService } from '../../apis/certification-api.service';

@NgModule({
  declarations: [
    ViewerComponent,
    IlpFpComponent,
    HtmlComponent,
    IapComponent,
    AudioComponent,
    VideoComponent,
    PdfComponent,
    PartOfComponent,
    ViewerTocComponent,
    YoutubeComponent,
    WebModuleComponent,
    CertificationComponent,
    CollectionComponent,
    TextModalComponent,
    RecommendationsComponent,
    VideojsComponent
  ],
  entryComponents: [TextModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ViewerRoutingModule,
    ActionBtnModule,
    UtilityModule,
    ElementFullscreenModule,
    CustomDirectivesModule,
    PluginQuizModule,
    PluginDndQuizModule,
    PluginHtmlPickerModule,
    PluginHandsOnModule,
    PluginClassDiagramModule,
    InteractiveVideoModule,
    RdbmsHandsonModule,
    SpinnerModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatRippleModule,
    MatTreeModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatDialogModule
  ],
  providers: [CertificationService, CertificationApiService]
})
export class ViewerModule {}
