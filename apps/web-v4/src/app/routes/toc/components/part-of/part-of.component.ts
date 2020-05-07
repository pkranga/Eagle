/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ContentService } from '../../../../services/content.service';
import { IContent } from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';

@Component({
  selector: 'app-part-of',
  templateUrl: './part-of.component.html',
  styleUrls: ['./part-of.component.scss']
})
export class PartOfComponent implements OnInit {
  @Input() contentId: string;
  partOf: IContent[] = [];
  fetchStatus: FetchStatus;
  constructor(private contentSvc: ContentService) {}

  ngOnInit() {
    this.fetchStatus = 'fetching';
    this.contentSvc.fetchContentParents(this.contentId).subscribe(
      partOfContent => {
        const parents =
          partOfContent && partOfContent.parents ? partOfContent.parents : {};
        if (
          Array.isArray(parents.learningPaths) &&
          parents.learningPaths.length > 0
        ) {
          this.partOf = [...this.partOf, ...parents.learningPaths];
        }
        if (Array.isArray(parents.courses) && parents.courses.length > 0) {
          this.partOf = [...this.partOf, ...parents.courses];
        }
        if (Array.isArray(parents.modules) && parents.modules.length > 0) {
          this.partOf = [...this.partOf, ...parents.modules];
        }
        if (!this.partOf.length) {
          this.fetchStatus = 'none';
        } else {
          this.fetchStatus = 'done';
        }
      },
      err => {
        this.fetchStatus = 'error';
      }
    );
  }
}
