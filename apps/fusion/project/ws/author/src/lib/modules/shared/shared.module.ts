/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatGridListModule } from '@angular/material/grid-list'
import { MatStepperModule } from '@angular/material/stepper'
import { ApiService } from './services/api.service'
import { MatTabsModule } from '@angular/material/tabs'
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatSidenavModule,
  MatAutocompleteModule,
  MatDialogModule,
  MatTooltipModule,
  MatDialogRef,
  MatSelectModule,
  MAT_DIALOG_DATA,
  MatChipsModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatCheckboxModule,
  MatSlideToggleModule,
  MatProgressBarModule,
} from '@angular/material'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatCardModule } from '@angular/material/card'
import { MatTreeModule } from '@angular/material/tree'
import { MatExpansionModule } from '@angular/material/expansion'
import { CommentsComponent } from './components/comments/comments.component'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { MatListModule } from '@angular/material/list'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { NotificationComponent } from './components/notification/notification.component'
import { CommentsDialogComponent } from './components/comments-dialog/comments-dialog.component'
import { RelativeUrlPipe } from './pipes/relative-url.pipe'
import { MatRadioModule } from '@angular/material/radio'
import { IprDialogComponent } from './components/ipr-dialog/ipr-dialog.component'
import { OrdinalsResolver } from './services/ordianls.resolver.service'
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component'
import { AccessControlService } from './services/access-control.service'
import { ImageCropModule } from '@ws-widget/utils/src/public-api'

@NgModule({
  declarations: [
    RelativeUrlPipe,
    CommentsComponent,
    NotificationComponent,
    CommentsDialogComponent,
    IprDialogComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatStepperModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatRadioModule,
    MatProgressBarModule,
    ImageCropModule,
  ],
  exports: [
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    RelativeUrlPipe,
    MatTooltipModule,
    CommentsComponent,
    MatAutocompleteModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatSidenavModule,
    ReactiveFormsModule,
    FormsModule,
    MatExpansionModule,
    MatListModule,
    MatSnackBarModule,
    NotificationComponent,
    CommentsDialogComponent,
    ConfirmDialogComponent,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTreeModule,
    MatRadioModule,
    MatProgressBarModule,
    IprDialogComponent,
    ImageCropModule,
  ],
  providers: [
    ApiService,
    AccessControlService,
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} },
    OrdinalsResolver,
  ],
  entryComponents: [
    NotificationComponent,
    IprDialogComponent,
    CommentsDialogComponent,
    ConfirmDialogComponent,
  ],
})
export class SharedModule { }
