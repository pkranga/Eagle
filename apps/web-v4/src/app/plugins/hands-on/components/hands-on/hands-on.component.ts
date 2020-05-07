/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// service imports
import { IProcessedViewerContent } from '../../../../services/viewer.service';

@Component({
  selector: 'ws-hands-on',
  templateUrl: './hands-on.component.html',
  styleUrls: ['./hands-on.component.scss']
})
export class HandsOnComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  paramSubscription;
  processedContent: IProcessedViewerContent;
  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
    });
  }
}
