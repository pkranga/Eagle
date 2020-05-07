/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter
} from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { IContent } from '../../../../models/content.model';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { UtilityService } from '../../../../services/utility.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-viewer-toc',
  templateUrl: './viewer-toc.component.html',
  styleUrls: ['./viewer-toc.component.scss']
})
export class ViewerTocComponent implements OnInit, OnChanges {
  @Input() toc: IContent;
  @Input() resource: IContent;
  @Input() flatList: IContent[];

  @Output() closeToc = new EventEmitter();

  pathSet = new Set();

  tocMode: 'FLAT' | 'TREE' = 'TREE';

  contentProgressHash: { [id: string]: number };
  nestedTreeControl: NestedTreeControl<IContent>;
  nestedDataSource: MatTreeNestedDataSource<IContent>;
  hasNestedChild = (_: number, nodeData: IContent) =>
    nodeData && nodeData.children && nodeData.children.length

  private _getChildren = (node: IContent) => {
    return node && node.children ? node.children : [];
  }

  constructor(private utilSvc: UtilityService, private userSvc: UserService) {
    this.nestedTreeControl = new NestedTreeControl<IContent>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnInit() {}

  ngOnChanges() {
    if (this.toc) {
      this.getContentProgressHash();
      this.nestedDataSource.data = this.toc.children;
      this.pathSet = new Set();
      of(true)
        .pipe(delay(2000))
        .subscribe(() => {
          this.expandThePath();
        });
    }
  }

  private getContentProgressHash() {
    this.userSvc.getProgressHash().subscribe(progressHash => {
      this.contentProgressHash = progressHash;
    });
  }

  expandThePath() {
    const path = this.utilSvc.getPath(this.toc, this.resource.identifier);
    this.pathSet = new Set(path.map(u => u.identifier));
    path.forEach(node => {
      this.nestedTreeControl.expand(node);
    });
  }

  changeTocMode() {
    if (this.tocMode === 'FLAT') {
      this.tocMode = 'TREE';
    } else {
      this.tocMode = 'FLAT';
    }
  }
}
