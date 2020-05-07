/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CohortsMiniprofileRoutingModule } from './cohorts-miniprofile-routing.module'
import { CohortsMiniprofileComponent } from './components/cohorts-miniprofile/cohorts-miniprofile.component'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'
import { MatDialog } from '@angular/material'
@NgModule({
  declarations: [CohortsMiniprofileComponent],
  imports: [
    CommonModule,
    CohortsMiniprofileRoutingModule,
  ],
})
export class CohortsMiniprofileModule {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    public dialog: MatDialog,
  ) {
    this.matIconRegistry.addSvgIcon(
      'twitter',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/twitter.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'facebook',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/facebook.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'linkedin',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/linkedin.svg'),
    )
    this.matIconRegistry.addSvgIcon(
      'location',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/current-location.svg'),
    )
  }
  openDialog() {
    const dialog = this.dialog.open(CohortsMiniprofileComponent, {
      panelClass: 'my-dialog',

    })
  }
}
