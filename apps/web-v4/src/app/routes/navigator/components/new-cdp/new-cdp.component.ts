/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';
import { IContent } from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';
import { NavigatorService } from '../../../../services/navigator.service';
import { ContentService } from '../../../../services/content.service';

interface VariantNode {
  name: string;
  description?: string;
  expanded?: boolean;
  content?: string[];
  certifications?: string[];
  children?: VariantNode[];
}

@Component({
  selector: 'ws-new-cdp',
  templateUrl: './new-cdp.component.html',
  styleUrls: ['./new-cdp.component.scss']
})
export class NewCdpComponent implements OnInit {

  selectedPath: VariantNode[] = [];
  selectedNode: VariantNode;
  content: IContent[];
  certifications: IContent[];

  variantFetchStatus: FetchStatus;
  contentFetchStatus: FetchStatus;

  constructor(
    public routingSvc: RoutingService,
    private navigatorSvc: NavigatorService, private contentSvc: ContentService
  ) { }

  ngOnInit() {
    this.variantFetchStatus = 'fetching';
    this.navigatorSvc.cdpLp.subscribe(data => {
      this.selectedNode = data.variantData[0];
      this.selectedPath.push(this.selectedNode);
      this.variantFetchStatus = 'done';
    }, err => {
      this.variantFetchStatus = 'error';
    });
  }

  selectVariant(variant: VariantNode) {
    this.selectedNode = variant;
    this.selectedPath.push(variant);
    this.updateContent();
  }

  selectNode(node: VariantNode) {
    this.selectedPath = this.selectedPath.slice(0, this.selectedPath.indexOf(node) + 1);
    this.selectedNode = node;
    this.updateContent();
  }

  updateContent() {
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
