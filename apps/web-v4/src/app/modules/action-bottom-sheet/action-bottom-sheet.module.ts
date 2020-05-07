/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// material
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

// components
import { ActionBottomTocComponent } from './components/action-bottom-toc/action-bottom-toc.component';
import { TocSheetComponent } from './components/toc-sheet/toc-sheet.component';
import { CustomDirectivesModule } from '../../directives/custom-directives.module';

@NgModule({
  declarations: [ActionBottomTocComponent, TocSheetComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatBottomSheetModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    CustomDirectivesModule
  ],
  entryComponents: [TocSheetComponent],
  exports: [ActionBottomTocComponent]
})
export class ActionBottomSheetModule {}
