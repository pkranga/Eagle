/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'ws-content-simplified-card',
  templateUrl: './content-simplified-card.component.html',
  styleUrls: ['./content-simplified-card.component.scss']
})
export class ContentSimplifiedCardComponent implements OnInit {
  @Input()
  content: IContent;
  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;
  constructor(private configSvc: ConfigService) {}

  ngOnInit() {}
}
