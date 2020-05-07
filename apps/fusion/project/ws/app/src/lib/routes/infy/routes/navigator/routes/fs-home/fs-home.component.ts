/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { LoggerService, TFetchStatus, ConfigurationsService } from '@ws-widget/utils'
import { NavigatorService } from '../../services/navigator.service'
import { IFsData, INavigatorCardModel } from '../../models/navigator.model'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-app-fs-home',
  templateUrl: './fs-home.component.html',
  styleUrls: ['./fs-home.component.scss'],
})
export class FsHomeComponent implements OnInit {
  fsData: INavigatorCardModel[]
  fullStackData: IFsData[]
  fetchStatus: TFetchStatus = 'none'
  defaultThumbnail = '/assets/images/missing-thumbnail.png'
  baseFsUrl = '/app/infy/navigator/fs/program/'

  constructor(
    private logger: LoggerService,
    private navSvc: NavigatorService,
    private router: Router,
    private configSvc: ConfigurationsService,
  ) {
    this.fsData = []
    this.fullStackData = []
  }

  ngOnInit() {
    if (this.configSvc.instanceConfig) {
      this.defaultThumbnail = this.configSvc.instanceConfig.logos.defaultContent
    }
    this.navSvc.fetchFullStackData().subscribe((data: IFsData[]) => {
      this.fullStackData = data
      this.logger.log('fshome', this.fsData)

      let count = 0
      // this.logger.log('data check fs', data)
      this.fullStackData = data
      this.logger.log(this.fullStackData[0])
      this.fullStackData.forEach((fs: IFsData) => {
        const stackData: INavigatorCardModel = {
          title: fs.fs_name,
          routeButton: String(fs.fs_id),
          thumbnail: fs.fs_image,
          linkedIds: fs.fs_linked_program,
          description: fs.fs_desc,
          type: 'fs',
        }
        this.fsData[count] = stackData
        count += 1
      })

      this.fsData.forEach(res => {
        this.navSvc.fetchImageForContentID(res.linkedIds).subscribe(meta => {
          if (meta) {
            res.thumbnail = meta[0].appIcon
          }
        })
        this.fetchStatus = 'done'

      })

    })
  }
  imageClicked(navigateRoute: string) {
    this.router.navigate([this.baseFsUrl + navigateRoute])
  }
}
