/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Directive, Input, HostListener, HostBinding, OnChanges } from '@angular/core'

@Directive({
  selector: '[wsUtilsDefaultThumbnail]',
})
export class DefaultThumbnailDirective implements OnChanges {

  @Input() wsUtilsDefaultThumbnail = ''
  @Input() src = ''
  isSrcUpdateAttemptedForDefault = false

  @HostBinding('src') srcUrl = ''
  @HostListener('error') updateSrc() {
    if (!this.isSrcUpdateAttemptedForDefault) {
      this.srcUrl = this.wsUtilsDefaultThumbnail
      this.isSrcUpdateAttemptedForDefault = true
    }
  }

  ngOnChanges() {
    if (this.src) {
      this.srcUrl = this.src
    }
  }

}
