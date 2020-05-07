/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { ContentService } from '../../../../services/content.service';
import { IContent } from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';
import { NavigatorService } from '../../../../services/navigator.service';

interface VariantNode {
  name: string;
  description?: string;
  expanded?: boolean;
  content?: string[];
  certifications?: string[];
  children?: VariantNode[];
}

@Component({
  selector: 'ws-cdp-learning-path',
  templateUrl: './cdp-learning-path.component.html',
  styleUrls: ['./cdp-learning-path.component.scss']
})
export class CdpLearningPathComponent implements OnInit {

  treeControl = new NestedTreeControl<VariantNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<VariantNode>();

  selectedNode: VariantNode;
  content: IContent[];
  certifications: IContent[];

  variantFetchStatus: FetchStatus;
  contentFetchStatus: FetchStatus;

  constructor(public routingSvc: RoutingService, private navigatorSvc: NavigatorService, private contentSvc: ContentService) {
  }

  hasChild = (_: number, node: VariantNode) => !!node.children && node.children.length > 0;

  ngOnInit() {
    this.variantFetchStatus = 'fetching';
    this.navigatorSvc.cdpLp.subscribe(data => {
      this.dataSource.data = data.variantData;
      this.nodeSelected(data.variantData[0]);
      this.variantFetchStatus = 'done';
    }, err => {
      this.variantFetchStatus = 'error';
    });
  }

  nodeSelected(node: VariantNode) {
    this.treeControl.expand(node);
    this.selectedNode = node;
    this.content = [];
    this.certifications = [];
    this.contentFetchStatus = 'fetching';
    this.contentSvc.fetchMultipleContent(
      (this.selectedNode.content || [])
        .concat(this.selectedNode.certifications || [])).subscribe(data => {
          const index = this.selectedNode.content ? this.selectedNode.content.length : 0;
          this.content = data.slice(0, index);
          this.certifications = data.slice(index);
          this.contentFetchStatus = 'done';
        }, err => {
          this.contentFetchStatus = 'error';
        });
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
}
