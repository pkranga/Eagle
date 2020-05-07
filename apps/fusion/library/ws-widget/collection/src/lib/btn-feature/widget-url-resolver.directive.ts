/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Directive, HostListener, Input } from '@angular/core'
import { Router } from '@angular/router'
import { MobileAppsService } from '../../../../../../src/app/services/mobile-apps.service'

@Directive({
  selector: '[wsWidgetUrlResolver]',
})
export class WidgetUrlResolverDirective {
  constructor(
    private router: Router,
    private mobileAppsSvc: MobileAppsService,
  ) { }

  @Input() wsWidgetUrlResolver!: boolean
  @Input() url!: string
  @Input() mobileAppFunction?: string
  @HostListener('click', ['$event'])
  clicked(event: Event) {
    event.preventDefault()
    if (this.mobileAppFunction && this.mobileAppsSvc.isMobile) {
      this.mobileAppsSvc.sendDataAppToClient(this.mobileAppFunction, {})
      return
    }
    if (!this.url) {
      return
    }
    if (this.wsWidgetUrlResolver) {
      this.router.navigate(['/externalRedirect', { externalUrl: this.url }], {
        skipLocationChange: true,
      })
    } else {
      this.router.navigateByUrl(this.url)
    }
  }
}
