/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit } from '@angular/core';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { TLearningMode, TContentType } from '../../../../models/content.model';

@Component({
  selector: 'app-content-type',
  templateUrl: './content-type.component.html',
  styleUrls: ['./content-type.component.scss']
})
export class ContentTypeComponent implements OnInit {
  @Input() mimeType: string;
  @Input() contentType: TContentType;
  @Input() learningMode: TLearningMode;
  @Input() resourceType: string;
  @Input() isExternalCourse: boolean;
  @Input() isExternal: 'Yes' | 'No';

  displayType: string;
  constructor() {}

  ngOnInit() {
    this.displayType = this.getDisplayType();
  }

  getDisplayType() {
    switch (this.mimeType) {
      case MIME_TYPE.ilpfp:
        return 'resource';
      case MIME_TYPE.html:
        // return this.resourceType === 'Certification' ? 'certification' : 'resource';
        if (this.resourceType === 'Certification') {
          return this.isExternal === 'No' || !this.isExternal ? 'certification' : 'external-certification';
        } else {
          return 'resource';
        }
      case MIME_TYPE.mp4:
      case MIME_TYPE.m3u8:
        return 'video';
      case MIME_TYPE.interaction:
        return 'interactive-video';
      case MIME_TYPE.mp3:
        return 'audio';
      case MIME_TYPE.pdf:
        return 'pdf';
      case MIME_TYPE.quiz:
        if (this.resourceType && this.resourceType === 'Assessment') {
          return 'assessment';
        }
        return 'quiz';
      case MIME_TYPE.youtube:
        return 'youtube';
      case MIME_TYPE.webModule:
        return 'web-module';
      case MIME_TYPE.iap:
        return 'iap';
      default:
        switch (this.contentType) {
          case 'Course':
            if (this.learningMode === 'Instructor-Led') {
              return 'instructor-led';
            }
            if (this.isExternalCourse) {
              return 'external';
            }
            return 'course';
          case 'Learning Path':
            return 'program';
          case 'Collection':
            return 'module';
          case 'Resource':
            return 'resource';
          case 'Knowledge Artifact':
            return 'knowledge-artifact';
        }
    }
    return 'none';
  }
}
