/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'

import { RegisteredUsersRoutingModule } from './registered-users-routing.module'
import { RegisteredUsersComponent } from './registered-users.component'
import {
  MatTableModule,
  MatSelectModule,
  MatCheckboxModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSnackBarModule,
} from '@angular/material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DialogDeregisterUserComponent } from './components/dialog-deregister-user/dialog-deregister-user.component'

@NgModule({
  declarations: [RegisteredUsersComponent, DialogDeregisterUserComponent],
  imports: [
    CommonModule,
    RegisteredUsersRoutingModule,
    MatTableModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
  ],
  entryComponents: [DialogDeregisterUserComponent],
})
export class RegisteredUsersModule { }
