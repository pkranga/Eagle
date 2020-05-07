/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { SafeUrl, DomSanitizer } from '@angular/platform-browser'
import { ActivatedRoute, Data } from '@angular/router'
import { Subscription } from 'rxjs'
import { Platform } from '@angular/cdk/platform'
import { ConfigurationsService, NsPage } from '@ws-widget/utils'

interface IMobileAppLink {
  appsAndroid: string
  appsAndroidMirror?: string
  appsIos: string
  appsIosSanitized?: SafeUrl
  showQrCode?: boolean
  code?: string
  isClient?: boolean
  appName?: string
  nameProvidedByClient?: string
  instructions?: string
  androidQR?: string
  androidMirrorQR?: string
  iosQR?: string
}

@Component({
  selector: 'ws-app-mobile-app-home',
  templateUrl: './mobile-app-home.component.html',
  styleUrls: ['./mobile-app-home.component.scss'],
})
export class MobileAppHomeComponent implements OnInit, OnDestroy {
  selectedTabIndex = this.matPlatform.IOS ? 1 : 0
  mobileLinks: IMobileAppLink | null = null
  isAndroidPlayStoreLink = false
  isClient = false
  mobilePlatformCode: string | undefined
  androidVal: string | undefined = undefined
  androidMirrorVal: string | null = null
  iosVal: string | null = null
  iosSanitizedVal: string | null = null
  routeSubscription: Subscription | null = null
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private matPlatform: Platform,
    private configSvc: ConfigurationsService,
  ) { }

  ngOnInit() {
    if (this.route) {
      this.routeSubscription = this.route.data.subscribe((data: Data) => {
        this.mobileLinks = data.pageData.data
        if (this.mobileLinks) {
          this.isClient = this.mobileLinks.isClient || false
          this.mobilePlatformCode = this.mobileLinks.code
          this.mobileLinks.appsIosSanitized = this.sanitizer.bypassSecurityTrustUrl(
            this.mobileLinks.appsIos,
          )
          if (this.mobileLinks.showQrCode) {
            this.isAndroidPlayStoreLink = true
          }
        }
      })
    }
  }

  ngOnDestroy() {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
  }
}
