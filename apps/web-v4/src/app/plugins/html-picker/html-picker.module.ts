/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// component imports
import { HtmlPickerComponent } from './components/html-picker/html-picker.component';

// module imports
import { HtmlPickerRoutingModule } from './html-picker-routing.module';
import { AceEditorModule } from 'ng2-ace-editor';

// material imports
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material';

@NgModule({
  declarations: [HtmlPickerComponent],
  imports: [
    CommonModule,
    HtmlPickerRoutingModule,
    AceEditorModule,
    MatExpansionModule,
    MatButtonModule
  ]
})
export class HtmlPickerModule {}
