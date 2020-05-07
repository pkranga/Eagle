/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpinnerModule } from '../spinner/spinner.module';
import { UtilityModule } from '../utility/utility.module';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';
import { ContentStripModule } from '../content-strip/content-strip.module';
import { ScrollHandlerModule } from '../scroll-handler/scroll-handler.module';
import { SearchStripModule } from '../search-strip/search-strip.module';
import { SHomeComponent } from './components/s-home/s-home.component';
import { HHomeComponent } from './components/h-home/h-home.component';
import { CarouselModule } from '../carousel/carousel.module';
import { MatDividerModule } from '@angular/material/divider';
import { ContentWidgetsModule } from '../content-widgets/content-widgets.module';
import { UnconsciousBiasComponent } from './components/unconscious-bias/unconscious-bias.component';
import { DigitalizationComponent } from './components/digitalization/digitalization.component';
import { ImageTitleComponent } from './components/image-title/image-title.component';
import { CardComponent } from './components/card/card.component';
import { LinkerComponent } from './components/linker/linker.component';
import { ImageOverlayTextComponent } from './components/image-overlay-text/image-overlay-text.component';

import { ParserComponent } from './components/parser/parser.component';
import { SafePipe } from './pipe/safe.pipe';
import { ChannelsComponent } from './components/channels/channels.component';
import { MainTitleComponent } from './components/main-title/main-title.component';
import { SliderComponent } from './components/slider/slider.component';
import { LinkerSmallComponent } from './components/linker-small/linker-small.component';
import { MatTabsModule } from "@angular/material/tabs";
@NgModule({
  declarations: [
    SafePipe,
    SHomeComponent,
    HHomeComponent,
    UnconsciousBiasComponent,
    DigitalizationComponent,
    ImageTitleComponent,
    CardComponent,
    LinkerComponent,
    ImageOverlayTextComponent,
    ParserComponent,
    ChannelsComponent,
    MainTitleComponent,
    SliderComponent,
    LinkerSmallComponent
  ],

  imports: [
    MatTabsModule,
    CommonModule,
    FormsModule,
    RouterModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatCardModule,
    MatButtonModule,
    CarouselModule,
    MatDividerModule,
    ContentWidgetsModule,
    SearchStripModule,
    ScrollHandlerModule,
    ContentStripModule,
    CustomDirectivesModule,
    SpinnerModule,
    UtilityModule
  ],
  exports: [ChannelsComponent]
})
export class SiemensModule { }
