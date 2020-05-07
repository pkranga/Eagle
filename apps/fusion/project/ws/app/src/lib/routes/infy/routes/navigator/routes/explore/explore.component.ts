/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { INavigatorCardModel, ILpData, IFsData } from '../../models/navigator.model'
import { TFetchStatus, LoggerService, ValueService } from '@ws-widget/utils'
import { NavigatorService } from '../../services/navigator.service'

@Component({
  selector: 'ws-app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  status: TFetchStatus = 'none'
  statusFs: TFetchStatus = 'none'
  lpData: INavigatorCardModel[]
  learningPathData: ILpData[] | undefined
  fsData: INavigatorCardModel[]
  fullStackData: IFsData[] | undefined
  smallScreen = false
  selectedIndex = 0
  isLtMedium$ = this.valueSvc.isLtMedium$
  screenSizeIsLtMedium = false
  selectionJava: any

  constructor(
    private navSvc: NavigatorService,
    private logger: LoggerService,
    private valueSvc: ValueService,

  ) {
    this.lpData = []
    this.fsData = []

    this.navSvc.fetchLearningPathData().subscribe((data: ILpData[]) => {
      let count = 0
      // this.logger.log('data check', data)
      this.learningPathData = data
      // this.logger.log(this.learningPathData[0])
      this.learningPathData.forEach((lp: ILpData) => {
        const pathData: INavigatorCardModel = {
          title: lp.lp_name,
          routeButton: String(lp.lp_id),
          thumbnail: lp.lp_image,
          linkedIds: lp.linked_program,
          description: lp.lp_description,
          type: 'lp',
        }
        this.lpData[count] = pathData
        count += 1
      })
      this.status = 'done'
    })

    this.navSvc.fetchFullStackData().subscribe((data: IFsData[]) => {
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
          // temporary
          // thumbnail: '/assets/images/content-card/AngularDeveloper.jpg',
          description: fs.fs_desc,
          type: 'fs',
        }
        this.fsData[count] = stackData
        count += 1
      })
      this.statusFs = 'done'
    })
  }

  ngOnInit() {
    this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.screenSizeIsLtMedium = isLtMedium
    })
  }
}
