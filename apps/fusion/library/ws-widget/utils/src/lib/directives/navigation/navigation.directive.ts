/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Directive, OnChanges, Input, HostBinding, HostListener } from '@angular/core'

@Directive({
  selector: '[wsUtilsNavigation]',
})
export class NavigationDirective implements OnChanges {
  @Input() wsUtilsNavigation = ''
  @Input() openInNewTab = false
  @Input()
  @HostBinding('attr.routerLink') routeUrl = ''
  @HostListener('mousedown', ['$event']) onMouseEnter($event: Event) {
    if (this.openInNewTab || this.wsUtilsNavigation.includes('mailto')) {
      $event.preventDefault()
      $event.stopPropagation()
      this.routeUrl = './'
      window.open(this.wsUtilsNavigation)
    }
  }
  constructor() { }

  ngOnChanges() {
    if (this.openInNewTab || this.wsUtilsNavigation.includes('mailto')) {
      this.routeUrl = './'
    }
  }

}
