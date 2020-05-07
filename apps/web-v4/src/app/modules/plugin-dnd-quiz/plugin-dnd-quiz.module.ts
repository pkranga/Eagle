/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatProgressBarModule,
  MatSelectModule,
  MatListModule,
  MatCardModule
} from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DndQuizComponent } from './components/dnd-quiz/dnd-quiz.component';
import { UtilityModule } from '../utility/utility.module';
import { DndSnippetComponent } from './components/dnd-snippet/dnd-snippet.component';
import { AutoscrollDirective } from './directives/autoscroll.directive';

@NgModule({
  declarations: [DndQuizComponent, DndSnippetComponent, AutoscrollDirective],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    ScrollingModule,
    UtilityModule,
    MatButtonModule,
    MatProgressBarModule,
    MatSelectModule,
    MatListModule,
    MatCardModule
  ],
  exports: [DndQuizComponent]
})
export class PluginDndQuizModule { }
