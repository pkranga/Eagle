/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-change-stories',
  templateUrl: './change-stories.component.html',
  styleUrls: ['./change-stories.component.scss']
})
export class ChangeStoriesComponent implements OnInit {
  INFY_DIARIES_PATH: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.INFY_DIARIES_PATH = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.configSvc.instanceConfig.features.navigateChange.config.jsonPaths
        .infyDiariesPath
    );
  }
}
