/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Directive, HostListener, ElementRef } from '@angular/core';
import { KhubService } from '../../../services/khub.service';

@Directive({
  selector: '[appFixedTop]'
})
export class FixedTopDirective {
  public browser = this.homeService.detectBrowser().browserName;
  constructor(private el: ElementRef, private homeService: KhubService) {}
  // used in search page to fix the refiners in top on scroll
  @HostListener('window:scroll') onScroll() {
    const currentScroll =
      this.browser === 'Netscape' ||
      this.browser === 'Microsoft Internet Explore'
        ? document.documentElement.scrollTop
        : document.scrollingElement.scrollTop;
    // console.log(this.browser);
    if (currentScroll > 100) {
      this.el.nativeElement.style.position = 'fixed';
      this.el.nativeElement.style.display = 'block';
      this.el.nativeElement.style.top = '20px';
      this.el.nativeElement.style.left = '2.5%';
    }
  }
}
