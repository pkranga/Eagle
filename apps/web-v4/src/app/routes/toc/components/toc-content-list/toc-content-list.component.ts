/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IContent } from '../../../../models/content.model';

@Component({
  selector: 'ws-toc-content-list',
  templateUrl: './toc-content-list.component.html',
  styleUrls: ['./toc-content-list.component.scss']
})
export class TocContentListComponent implements OnInit {
  @Input() content: IContent;

  tocMode: 'FLAT' | 'TREE' = 'TREE';
  constructor() {}

  ngOnInit() {}

  cardTrackBy(index: number, item: IContent) {
    return item.identifier;
  }
  changeTocMode() {
    if (this.tocMode === 'FLAT') {
      this.tocMode = 'TREE';
    } else {
      this.tocMode = 'FLAT';
    }
  }
  get contentResources(): IContent[] {
    return this.accumulateResources(this.content, []);
  }
  private accumulateResources(content: IContent, children: IContent[] = []): IContent[] {
    if (!content.children || !content.children.length) {
      return [...children, content];
    }
    content.children.forEach(child => {
      children = this.accumulateResources(child, children);
    });
    return children;
  }

}
