/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// module imports
import { PdfRoutingModule } from './pdf-routing.module';

// compenent imports
import { PdfComponent } from './components/pdf/pdf.component';

@NgModule({
  declarations: [PdfComponent],
  imports: [CommonModule, PdfRoutingModule]
})
export class PdfModule {}
