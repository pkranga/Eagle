/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';
import { ContentService } from '../../../../services/content.service';
import { IContent } from '../../../../models/content.model';

@Component({
  selector: 'app-part-of',
  templateUrl: './part-of.component.html',
  styleUrls: ['./part-of.component.scss']
})
export class PartOfComponent implements OnInit, OnChanges {
  @Input() resourceId: string;
  @Input() collectionId: string;

  @Output() collectionCountChange = new EventEmitter<number>();
  private processedResourceId: string = null;
  courses: IContent[] = [];
  programs: IContent[] = [];
  modules: IContent[] = [];
  totalVisible = 0;
  // partOf: IResourceParents = {parents: {}};
  constructor(private contentSvc: ContentService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.resourceId && this.resourceId !== this.processedResourceId) {
      this.contentSvc
        .fetchContentParents(this.resourceId)
        .subscribe(partOfContent => {
          const parents =
            partOfContent && partOfContent.parents ? partOfContent.parents : {};
          if (
            Array.isArray(parents.learningPaths) &&
            parents.learningPaths.length > 0
          ) {
            this.programs = parents.learningPaths.filter(
              content => content.identifier !== this.collectionId
            );
          }
          if (Array.isArray(parents.courses) && parents.courses.length > 0) {
            this.courses = parents.courses.filter(
              content => content.identifier !== this.collectionId
            );
          }
          if (Array.isArray(parents.modules) && parents.modules.length > 0) {
            this.modules = parents.modules.filter(
              content => content.identifier !== this.collectionId
            );
          }
          this.totalVisible =
            this.programs.length + this.courses.length + this.modules.length;
          this.collectionCountChange.emit(this.totalVisible);
        });
    }
  }
}
