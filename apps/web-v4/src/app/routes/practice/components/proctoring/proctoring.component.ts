/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ContentService } from '../../../../services/content.service';
import { MobileAppsService } from '../../../../services/mobile-apps.service';

@Component({
  selector: 'app-proctoring',
  templateUrl: './proctoring.component.html',
  styleUrls: ['./proctoring.component.scss']
})
export class ProctoringComponent implements OnInit {
  contentId: string;
  contestUrl: string;
  content: IContent;
  showLoader = true;
  errorMessageCode:
    | 'PROCTOR_URL_MISSING'
    | 'API_FAILURE'
    | 'NO_CONTENT_ID'
    | 'IFRAME_FAILURE';
  srcUrl: SafeResourceUrl;
  constructor(
    private sanitizer: DomSanitizer,
    private activatedRoute: ActivatedRoute,
    private contentSvc: ContentService,
    private mobileAppsSvc: MobileAppsService
  ) {}

  ngOnInit() {
    this.contestUrl = decodeURIComponent(
      this.activatedRoute.snapshot.queryParams['contestUrl']
    );
    // console.log('this.contestUrl >', this.contestUrl, typeof this.contestUrl)
    if (this.contestUrl === 'undefined') {
      // console.log('params no contest url>')
      this.activatedRoute.params.subscribe(params => {
        this.contentId = params['contentid'];
        this.fetchCourseDetails();
      });
    } else {
      this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        this.contestUrl
      );
      this.mobileAppsSvc.iosOpenInBrowserRequest(window.location.href);
    }
  }

  private fetchCourseDetails() {
    if (!this.contentId) {
      this.showLoader = false;
      this.errorMessageCode = 'NO_CONTENT_ID';
      return;
    }
    this.contentSvc.fetchContent(this.contentId).subscribe(
      data => {
        this.content = data;
        if (this.isValidContent()) {
          this.mobileAppsSvc.iosOpenInBrowserRequest(window.location.href);
          this.srcUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            this.content.proctorUrl
          );
        }
      },
      err => {
        this.showLoader = false;
        this.errorMessageCode = 'API_FAILURE';
      }
    );
  }

  private isValidContent(): boolean {
    if (!this.content.proctorUrl) {
      this.showLoader = false;
      this.errorMessageCode = 'PROCTOR_URL_MISSING';
      return false;
    }
    return true;
  }
}
