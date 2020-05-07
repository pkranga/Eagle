/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PracticeRoutingModule } from './practice-routing.module';
import { SpinnerModule } from '../../modules/spinner/spinner.module';

// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatCardModule } from '@angular/material';

import { PracticeComponent } from './components/practice/practice.component';
import { SanitizeUrlPipe } from './pipes/sanitize-url.pipe';
import { ProctoringComponent } from './components/proctoring/proctoring.component';

@NgModule({
  declarations: [PracticeComponent, SanitizeUrlPipe, ProctoringComponent],
  imports: [
    CommonModule,
    PracticeRoutingModule,
    SpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class PracticeModule {}
