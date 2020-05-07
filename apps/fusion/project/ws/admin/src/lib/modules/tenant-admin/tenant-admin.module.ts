/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'

import { TenantAdminRoutingModule } from './tenant-admin-routing.module'
import { TenantAdminComponent } from './tenant-admin.component'
import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTooltipModule,
  MatListModule,
  MatSidenavModule,
  MatCardModule,
  MatExpansionModule,
  MatRadioModule,
  MatChipsModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatSnackBarModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
} from '@angular/material'
import { HomeComponent } from './routes/page/home/home.component'
import {
  BtnPageBackModule,
  UserAutocompleteModule,
  PickerContentModule,
} from '@ws-widget/collection'
import { RouterModule } from '@angular/router'
import { BannerComponent } from './routes/page/home/components/banner/banner.component'
import { ContentStripRequestComponent } from './routes/page/home/components/content-strip-request/content-strip-request.component'
import { IdsRequestComponent } from './routes/page/home/components/ids-request/ids-request.component'
import { ApiRequestComponent } from './routes/page/home/components/api-request/api-request.component'
import { SearchRequestComponent } from './routes/page/home/components/search-request/search-request.component'
import { TenantAdminService } from './tenant-admin.service'
import { DragDropModule } from '@angular/cdk/drag-drop'
import { UserRolesComponent } from './routes/user-roles/user-roles.component'
import { ModifyRolesDialogComponent } from './routes/user-roles/components/modify-roles-dialog/modify-roles-dialog.component'
import { EditBannersDialogComponent } from './routes/page/home/components/edit-banners-dialog/edit-banners-dialog.component'
import { UserRegistrationComponent } from './routes/user-registration/user-registration.component'

@NgModule({
  declarations: [
    TenantAdminComponent,
    HomeComponent,
    BannerComponent,
    ContentStripRequestComponent,
    IdsRequestComponent,
    ApiRequestComponent,
    SearchRequestComponent,
    UserRolesComponent,
    ModifyRolesDialogComponent,
    EditBannersDialogComponent,
    UserRegistrationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TenantAdminRoutingModule,
    UserAutocompleteModule,
    RouterModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    BtnPageBackModule,
    MatCardModule,
    MatExpansionModule,
    MatRadioModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule,
    PickerContentModule,
    DragDropModule,
    MatCardModule,
    MatDialogModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [TenantAdminService],
  entryComponents: [ModifyRolesDialogComponent, EditBannersDialogComponent],
})
export class TenantAdminModule { }
