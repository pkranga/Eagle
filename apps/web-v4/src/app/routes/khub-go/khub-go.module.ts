/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { D3GraphsModule } from '../../modules/d3-graphs/d3-graphs.module';
import { ProgressModule } from '../../modules/progress/progress.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';
import { UtilityModule } from '../../modules/utility/utility.module';
import { HomeBubbleComponent } from './components/home-bubble/home-bubble.component';
import { HomeCourosalComponent } from './components/home-courosal/home-courosal.component';
// import { ItemTileMobileComponent } from './components/item-tile-mobile/item-tile-mobile.component';
import { ItemTileSliderComponent } from './components/item-tile-slider/item-tile-slider.component';
import { ItemTileComponent } from './components/item-tile/item-tile.component';
import { ItemsListComponent } from './components/items-list/items-list.component';
import { KhubHomeComponent } from './components/khub-home/khub-home.component';
import { KhubSearchComponent } from './components/khub-search/khub-search.component';
import { KhubViewComponent } from './components/khub-view/khub-view.component';
import { ModalpopupComponent } from './components/modalpopup/modalpopup.component';
import { NeovisComponent } from './components/neovis/neovis.component';
import { ProjectSnapshotComponent } from './components/project-snapshot/project-snapshot.component';
import { TopicTaggerComponent } from './components/topic-tagger/topic-tagger.component';
import { KhubGoRoutingModule } from './khub-go-routing.module';
import { KhubMaterialModule } from './khubMaterial';
import { DisplayNamePipe } from './pipes/display-name.pipe';
import { FixedTopDirective } from './pipes/fixed-top.directive';
import { KeysPipe } from './pipes/keys.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { TrimAndReducePipe } from './pipes/trim-and-reduce.pipe';
@NgModule({
  declarations: [
    KhubHomeComponent,
    HomeBubbleComponent,
    KeysPipe,
    SafeHtmlPipe,
    TrimAndReducePipe,
    ItemTileComponent,
    // ItemTileMobileComponent,
    ItemTileSliderComponent,
    HomeCourosalComponent,
    DisplayNamePipe,
    KhubViewComponent,
    NeovisComponent,
    KhubSearchComponent,
    ModalpopupComponent,
    ProjectSnapshotComponent,
    ItemsListComponent,
    TopicTaggerComponent,
    FixedTopDirective
  ],
  imports: [
    CommonModule,
    KhubGoRoutingModule,
    KhubMaterialModule,
    SpinnerModule,
    ProgressModule,
    UtilityModule,
    D3GraphsModule
  ],
  exports: [KhubSearchComponent]
})
export class KhubGoModule {}
