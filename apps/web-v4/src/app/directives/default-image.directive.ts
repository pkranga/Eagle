/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'img[appDefaultImage]',
  host: {
    '(error)': 'updateUrl()',
    '[src]': 'src'
  },
  jit: true
})
export class DefaultImageDirective {
  @Input() src: string;
  @Input() appDefaultImage: string;
  private updateUrlAttempted = true;
  updateUrl() {
    // Try updating the url only once
    if (this.updateUrlAttempted) {
      this.updateUrlAttempted = false;
      this.src = this.appDefaultImage;
    }
  }
}
