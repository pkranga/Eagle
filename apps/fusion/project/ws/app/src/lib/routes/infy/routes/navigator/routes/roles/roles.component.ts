/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { TFetchStatus, LoggerService } from '@ws-widget/utils'
import { NavigatorService } from '../../services/navigator.service'
import { IOfferings, IRole } from '../../models/navigator.model'
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout'

@Component({
  selector: 'ws-app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  status: TFetchStatus = 'none'
  rolesData!: IOfferings
  smallScreen = false
  selectedTrack = 'Accelerate'
  currentTrackData!: IRole[]
  hasMore = false

  isSmallScreen$ = this.breakpointObserver.observe(Breakpoints.XSmall)
  constructor(
    private navSvc: NavigatorService,
    private logger: LoggerService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.navSvc.fetchNavigatorRoles().subscribe((data: IOfferings) => {
      this.rolesData = data
      this.logger.log('roles data', this.rolesData, this.rolesData.Accelerate.roles)
      this.currentTrackData = this.rolesData.Accelerate.roles
      this.status = 'done'
    })

    this.isSmallScreen$.subscribe((breakPointState: BreakpointState) => {
      if (breakPointState.matches) {
        this.smallScreen = true
      } else {
        this.smallScreen = false
      }
    })
  }

  ngOnInit() {}

  trackClicked(newTrack: string) {
    this.selectedTrack = newTrack
    this.hasMore = false
    if (newTrack === 'Assure') {
      this.currentTrackData = this.rolesData.Assure.roles
    } else if (newTrack === 'Experience') {
      this.currentTrackData = this.rolesData.Experience.roles
    } else if (newTrack === 'Insight') {
      this.currentTrackData = this.rolesData.Insight.roles
    } else if (newTrack === 'Innovate') {
      this.currentTrackData = this.rolesData.Innovate.roles
    } else {
      this.currentTrackData = this.rolesData.Accelerate.roles
    }
    if (this.currentTrackData.length > 3) {
      this.hasMore = true
    }
  }
}
