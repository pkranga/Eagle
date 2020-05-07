/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SkillsSelectComponent } from './skills-select.component'
import { MatDialogModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatButtonModule } from '@angular/material'
import { FormsModule } from '@angular/forms'

@NgModule({
  declarations: [
    SkillsSelectComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
  ],
  exports: [SkillsSelectComponent],
  entryComponents: [SkillsSelectComponent],
})
export class SkillsSelectModule { }
