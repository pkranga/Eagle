/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsContent, MiniProfileComponent } from '@ws-widget/collection'
import { ActivatedRoute } from '@angular/router'
import { MatDialog } from '@angular/material'
path
path
import { ConfigurationsService } from '../../../../../../../../../library/ws-widget/utils/src/public-api'

@Component({
path
path
path
})

export class AppTocCohortsPathfindersComponent implements OnInit {

  @Input() content!: NsContent.IContent
  cohortsDetails: NsTocPathfinders.IAttendedUsers[] = []
  fetchingCohorts = true

  constructor(
    private tocSvc: AppTocPathfindersService,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    if (this.activatedRoute.parent && this.activatedRoute.parent.data) {
      this.activatedRoute.parent.data.subscribe(
        (data: any) => {
          if (data && data.content && data.content.data) {
            this.content = data.content.data
            this.getCohorts()
          }
        },
      )
    }
  }
  // getCohorts() {
  //   if (this.content && this.content.labels) {
  //     this.tocSvc.fetchCohortGroupUsers(parseInt(this.content.labels[0], 10)).subscribe(
  //       (res: NsCohorts.ICohortsGroupUsers[]) => {
  //         if (this.configSvc.userProfile) {
  //           this.cohortsDetails = res.filter(cohort =>
  //             cohort.email !== (this.configSvc.userProfile ? this.configSvc.userProfile.email : null))
  //         } else {
  //           this.cohortsDetails = res
  //         }
  //         this.cohortsDetails.forEach(user => {
  //           user.name = `${user.first_name} ${user.last_name}`
  //         })
  //         this.fetchingCohorts = false
  //       },
  //       _ => {
  //         this.fetchingCohorts = false
  //       },
  //     )
  //   }
  // }

  getCohorts() {
    if (this.content) {
      this.tocSvc.fetchAttendedUsers(this.content.identifier).subscribe(
        (response: NsTocPathfinders.IAttendedUsers[]) => {
          this.cohortsDetails = response ? response.filter(cohort =>
            cohort.email !== (this.configSvc.userProfile ? this.configSvc.userProfile.email : null)) : []
          this.fetchingCohorts = false
        },
        _ => {
          this.fetchingCohorts = false
        },
      )
    }
  }
  openDialog(wid: string): void {
    const dialogRef = this.dialog.open(MiniProfileComponent, {
      width: '410px',
      data: wid,
    })
    dialogRef.afterClosed().subscribe((_result: any) => {
    })
  }
}
