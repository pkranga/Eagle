/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { IContent } from '../../../../models/content.model';
import { ConfigService } from '../../../../services/config.service';
import { MobileAppsService } from '../../../../services/mobile-apps.service';
import { UtilityService } from '../../../../services/utility.service';

@Component({
  selector: 'app-btn-download',
  templateUrl: './btn-download.component.html',
  styleUrls: ['./btn-download.component.scss']
})
export class BtnDownloadComponent implements OnInit {
  @Input()
  content: IContent;

  downloadable = false;
  isDownloaded = false;
  constructor(
    private snackBar: MatSnackBar,
    private mobAppSvc: MobileAppsService,
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {
    this.downloadable = this.mobAppSvc.isMobile && this.isContentDownloadable();
    this.mobAppSvc.getDownloadStatusFor(this.content.identifier).subscribe(isDownloaded => {
      this.isDownloaded = isDownloaded;
    });
  }

  // Download
  download(event: Event, downloadedMessage: string) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.isDownloaded) {
      if (!this.configSvc.instanceConfig.features.btnDownload.available) {
        this.utilSvc.featureUnavailable();
        return;
      }
      this.mobAppSvc.downloadResource(this.content.identifier);
    } else {
      this.snackBar.open(downloadedMessage);
    }
  }

  private isContentDownloadable(): boolean {
    if (this.content) {
      if (
        this.content.contentType === 'Learning Path' ||
        this.content.resourceType === 'Assessment' ||
        (this.content.mimeType !== MIME_TYPE.collection && !this.content.downloadUrl) ||
        this.content.isExternalCourse
      ) {
        return false;
      }
      switch (this.content.mimeType) {
        case MIME_TYPE.mp3:
        case MIME_TYPE.mp4:
        case MIME_TYPE.quiz:
        case MIME_TYPE.pdf:
        case MIME_TYPE.webModule:
        case MIME_TYPE.collection:
          return true;
        default:
          return false;
      }
    }
    return false;
  }
}
