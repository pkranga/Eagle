/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { IData } from '../../../../models/exercise-submission.model';
import { ExerciseService } from '../../../../services/exercise-submission.service';
import { ValuesService } from '../../../../services/values.service';

@Component({
  selector: 'app-view-content',
  templateUrl: './view-content.component.html',
  styleUrls: ['./view-content.component.scss']
})
export class ViewContentComponent implements OnInit, AfterViewInit {
  @Input() data: IData;
  fetchingText = false;
  @ViewChild('viewContent', { static: false }) viewContentRef: ElementRef<HTMLDivElement>;

  processedContent: string;
  pdfUrl: SafeResourceUrl;
  mimeType = MIME_TYPE;

  pdfPluginPath = '/public-assets/common/plugins/pdf/web/viewer.html';

  showFullScreenButton: boolean;

  constructor(
    private valueSvs: ValuesService,
    private domSanitizer: DomSanitizer,
    private exerciseSvc: ExerciseService
  ) { }

  ngOnInit() {
    if (this.data) {
      if (this.data.url) {
        this.data.url = (this.data.url || '').replace(
          this.valueSvs.CONTENT_URL_PREFIX_REGEX,
          ''
        );
      }
      if (this.data.type === 'input' && this.data.url) {
        this.fetchingText = true;
        this.exerciseSvc.fetchFeedbackText(this.data.url).subscribe(data => {
          this.fetchingText = false;
          this.processedContent = data;
        }, err => {
          this.fetchingText = false;
        });
      }

      if (this.data.type === this.mimeType.pdf && this.data.url) {
        this.pdfUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.pdfPluginPath +
          `?file=${encodeURIComponent(this.data.url)}`);
      }
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.showFullScreenButton = true;
    }, 0);
  }
}
