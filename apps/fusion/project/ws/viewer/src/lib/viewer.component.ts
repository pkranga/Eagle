/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy, AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Subscription } from 'rxjs'
import { ValueService } from '@ws-widget/utils'
import { ViewerDataService, TStatus } from './viewer-data.service'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { RootService } from '../../../../../src/app/component/root/root.service'
import { NsContent } from '@ws-widget/collection'

export enum ErrorType {
  accessForbidden = 'accessForbidden',
  notFound = 'notFound',
  internalServer = 'internalServer',
  serviceUnavailable = 'serviceUnavailable',
  somethingWrong = 'somethingWrong',
  mimeTypeMismatch = 'mimeTypeMismatch',
  previewUnAuthorised = 'previewUnAuthorised',
}

@Component({
  selector: 'viewer-container',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})

export class ViewerComponent implements OnInit, OnDestroy, AfterViewChecked {
  fullScreenContainer: HTMLElement | null = null
  content: NsContent.IContent | null = null
  errorType = ErrorType
  private isLtMedium$ = this.valueSvc.isLtMedium$
  sideNavBarOpened = false
  mode: 'over' | 'side' = 'side'
  isTypeOfCollection = true
  collectionId = this.activatedRoute.snapshot.queryParamMap.get('collectionId')
  status: TStatus = 'none'
  error: any | null = null
  isNotEmbed = true
  errorWidgetData: NsWidgetResolver.IRenderConfigWithTypedData<any> = {
    widgetType: 'errorResolver',
    widgetSubType: 'errorResolver',
    widgetData: {
      errorType: '',
    },
  }
  private screenSizeSubscription: Subscription | null = null
  private resourceChangeSubscription: Subscription | null = null
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private valueSvc: ValueService,
    private dataSvc: ViewerDataService,
    private rootSvc: RootService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.rootSvc.showNavbarDisplay$.next(false)
  }

  getContentData(e: any) {
    e.activatedRoute.data.subscribe((data: { content: { data: NsContent.IContent } }) => {
      this.content = data.content.data
    })
  }

  ngOnInit() {
    this.isNotEmbed = this.activatedRoute.snapshot.queryParams.embed === 'true' ? false : true
    this.isTypeOfCollection = this.activatedRoute.snapshot.queryParams.collectionType ? true : false
    this.screenSizeSubscription = this.isLtMedium$.subscribe(isSmall => {
      // this.sideNavBarOpened = !isSmall
      this.sideNavBarOpened = isSmall ? false : true
      this.mode = isSmall ? 'over' : 'side'
    })
    this.resourceChangeSubscription = this.dataSvc.changedSubject.subscribe(_ => {
      this.status = this.dataSvc.status
      this.error = this.dataSvc.error
      if (this.error && this.error.status) {
        switch (this.error.status) {
          case 403: {
            this.errorWidgetData.widgetData.errorType = ErrorType.accessForbidden
            break
          }
          case 404: {
            this.errorWidgetData.widgetData.errorType = ErrorType.notFound
            break
          }
          case 500: {
            this.errorWidgetData.widgetData.errorType = ErrorType.internalServer
            break
          }
          case 503: {
            this.errorWidgetData.widgetData.errorType = ErrorType.serviceUnavailable
            break
          }
          default: {
            this.errorWidgetData.widgetData.errorType = ErrorType.somethingWrong
            break
          }
        }
      }
      if (this.error && (this.error.errorType === this.errorType.mimeTypeMismatch)) {
        setTimeout(
          () => {
            this.router.navigate([this.error.probableUrl])
          },
          3000,
        )
      }
      if (this.error && (this.error.errorType === this.errorType.previewUnAuthorised)) {

      }
      // console.log(this.error)
    })
  }

  ngAfterViewChecked() {
    const container = document.getElementById('fullScreenContainer')
    if (container) {
      this.fullScreenContainer = container
      this.changeDetector.detectChanges()
    } else {
      this.fullScreenContainer = null
      this.changeDetector.detectChanges()
    }
  }

  ngOnDestroy() {
    this.rootSvc.showNavbarDisplay$.next(true)
    if (this.screenSizeSubscription) {
      this.screenSizeSubscription.unsubscribe()
    }
    if (this.resourceChangeSubscription) {
      this.resourceChangeSubscription.unsubscribe()
    }
  }

  toggleSideBar() {
    this.sideNavBarOpened = !this.sideNavBarOpened
  }

}
