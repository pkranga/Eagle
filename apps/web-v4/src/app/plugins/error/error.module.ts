/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
// material imports
import { MatCardModule } from '@angular/material';
// component imports
import { ErrorComponent } from './components/error/error.component';
// module imports
import { ErrorRoutingModule } from './error-routing.module';

@NgModule({
  declarations: [ErrorComponent],
  imports: [CommonModule, ErrorRoutingModule, MatCardModule]
})
export class ErrorModule {}
