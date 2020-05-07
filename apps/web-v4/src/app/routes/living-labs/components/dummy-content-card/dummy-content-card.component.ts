/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-dummy-content-card',
  templateUrl: './dummy-content-card.component.html',
  styleUrls: ['./dummy-content-card.component.scss']
})
export class DummyContentCardComponent implements OnInit {
  @Input()
  thumbnail: string;

  @Input()
  name: string;

  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;

  constructor(private configSvc: ConfigService) {}

  ngOnInit() {}
}
