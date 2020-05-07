/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IContent, IContentCardHash } from '../../../../models/content.model';

@Component({
  selector: 'app-content-strip',
  templateUrl: './content-strip.component.html',
  styleUrls: ['./content-strip.component.scss']
})
export class ContentStripComponent implements OnInit {
  @Input() showLock = false;
  @Input() requestFor: string;
  @Input() contents: IContent[];
  @Input() contentStripHash: { [identifier: string]: IContentCardHash };
  @Input() contentStatus: string;
  @Input() heading = '';
  @Input() cardType: 'basic' | 'advanced' = 'advanced';

  @Output() loadNext = new EventEmitter();
  constructor() { }

  ngOnInit() {
    if (this.contents && this.showLock) {
      this.contents.forEach((content, index) => {
        if (index === 0 && this.requestFor === 'stream') {
          content.isLocked = true;
        } else if (index > 0 && (this.requestFor === 'generic' || this.requestFor === 'stream')) {
          content.isLocked = true;
        }
      });
    }
  }

  contentTrackBy(index: number, item: IContent) {
    if (item) {
      if (item.identifier) {
        return item.identifier;
      }
      return item;
    }
    return index;
  }
}
