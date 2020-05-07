/*               "Copyright 2020 Infosys Ltd.
http://http-url
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core'
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser'
import { NsContent } from '@ws-widget/collection'
import { TFetchStatus } from '@ws-widget/utils/src/public-api'
import { Router } from '@angular/router'
import { MobileAppsService } from '../../../../../../../src/app/services/mobile-apps.service'
import { MatSnackBar } from '@angular/material/snack-bar'

import { ConfigurationsService } from '@ws-widget/utils'

@Component({
  selector: 'viewer-plugin-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss'],
})
export class HtmlComponent implements OnInit, OnChanges {

  // private mobileOpenInNewTab!: any

  @ViewChild('mobileOpenInNewTab', { read: ElementRef, static: false }) mobileOpenInNewTab !: ElementRef<HTMLAnchorElement>
  @Input() htmlContent: NsContent.IContent | null = null
  iframeUrl: SafeResourceUrl | null = null

  showIframeSupportWarning = false
  showIsExternalMessage = false
  showUnBlockMessage = false
  pageFetchStatus: TFetchStatus | 'artifactUrlMissing' = 'fetching'
  isUserInIntranet = false
  intranetUrlPatterns: string[] | undefined = []
  isIntranetUrl = false
  progress = 100
  constructor(
    private domSanitizer: DomSanitizer,
    public mobAppSvc: MobileAppsService,
http://http-url
    private router: Router,
    private configSvc: ConfigurationsService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    // this.mobAppSvc.simulateMobile()
  }

  ngOnChanges() {
    this.isIntranetUrl = false
    this.intranetUrlPatterns = this.configSvc.instanceConfig
      ? this.configSvc.instanceConfig.intranetIframeUrls
      : []

    // console.log(this.htmlContent)
    let iframeSupport: boolean | string | null =
      this.htmlContent && this.htmlContent.isIframeSupported
    if (this.htmlContent && this.htmlContent.artifactUrl) {
http://http-url
        this.htmlContent.isIframeSupported = 'No'
      }
      if (typeof iframeSupport !== 'boolean') {
        iframeSupport = this.htmlContent.isIframeSupported.toLowerCase()
        if (iframeSupport === 'no') {
          this.showIframeSupportWarning = true
          setTimeout(
            () => {
              this.openInNewTab()
            },
            3000,
          )
          setInterval(
            () => {
              this.progress -= 1
            },
            30,
          )
        } else if (iframeSupport === 'maybe') {
          this.showIframeSupportWarning = true
        }
      }
      if (this.intranetUrlPatterns && this.intranetUrlPatterns.length) {
        this.intranetUrlPatterns.forEach(iup => {
          if (this.htmlContent && this.htmlContent.artifactUrl) {
            if (this.htmlContent.artifactUrl.startsWith(iup)) {
              this.isIntranetUrl = true
            }
          }
        })
      }
      // if (this.htmlContent.isInIntranet || this.isIntranetUrl) {
      //   this.checkIfIntranet().subscribe(
      //     data => {
      //       console.log(data)
      //       this.isUserInIntranet = data ? true : false
      //       console.log(this.isUserInIntranet)
      //     },
      //     () => {
      //       this.isUserInIntranet = false
      //       console.log(this.isUserInIntranet)
      //     },
      //   )
      // }
      const isExternal = this.htmlContent.isExternal
      if (isExternal) {
        this.showIsExternalMessage = true
        setTimeout(
          () => {
            this.showIsExternalMessage = false
          },
          5000,
        )
      }
      this.iframeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
        this.htmlContent.artifactUrl,
      )
    } else if (this.htmlContent && this.htmlContent.artifactUrl === '') {
      this.iframeUrl = null
      this.pageFetchStatus = 'artifactUrlMissing'
    } else {
      this.iframeUrl = null
      this.pageFetchStatus = 'error'
    }
  }

  backToDetailsPage() {
    this.router.navigate([
      `/app/toc/${this.htmlContent ? this.htmlContent.identifier : ''}/overview`,
    ])
  }

  openInNewTab() {
    if (this.htmlContent) {
      if (this.mobAppSvc && this.mobAppSvc.isMobile) {
        // window.open(this.htmlContent.artifactUrl)
        setTimeout(
          () => {
            this.mobileOpenInNewTab.nativeElement.click()
          },
          0,
        )
      } else {
        const width = window.outerWidth
        const height = window.outerHeight
        const isWindowOpen = window.open(
          this.htmlContent.artifactUrl,
          '_blank',
          `toolbar=yes,
             scrollbars=yes,
             resizable=yes,
             menubar=no,
             location=no,
             addressbar=no,
             top=${(15 * height) / 100},
             left=${(2 * width) / 100},
             width=${(65 * width) / 100},
             height=${(70 * height) / 100}`,
        )
        if (isWindowOpen === null) {
          const msg = 'The pop up window has been blocked by your browser, please unblock to continue.'
          this.snackBar.open(msg)
        }
      }
    }
  }
  dismiss() {
    this.showIframeSupportWarning = false
    this.isIntranetUrl = false
  }

  onIframeLoadOrError(evt: 'load' | 'error') {
    setTimeout(
      () => {
        this.pageFetchStatus = evt === 'load' ? 'done' : 'error'
      },
      0,
    )
  }

  // checkIfIntranet(): Observable<boolean> {
http://http-url
http://http-url
http://http-url
http://http-url
http://http-url
  //   // tslint:disable-next-line: deprecation
http://http-url
  //     mapTo(true),
  //     catchError(err => {
  //       console.log('error', err)
  //       return of(false)
  //     }),
  //   )
http://http-url
  // }
}
