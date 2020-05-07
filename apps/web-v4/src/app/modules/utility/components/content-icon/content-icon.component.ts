/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input, OnInit } from '@angular/core';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { IContent } from '../../../../models/content.model';

@Component({
  selector: 'app-content-icon',
  templateUrl: './content-icon.component.html',
  styleUrls: ['./content-icon.component.scss']
})
export class ContentIconComponent implements OnInit {
  @Input() content: IContent;
  iconType: string;
  constructor() {}

  ngOnInit() {
    this.iconType = this.getIconType();
  }

  getIconType(): string {
    switch (this.content.mimeType) {
      case MIME_TYPE.ilpfp:
        return 'resource';
      case MIME_TYPE.html:
        return this.content.resourceType === 'Certification' ? 'certification' : 'resource';
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
        if (this.content.resourceType && this.content.resourceType === 'Assessment') {
          return 'assessment';
        }
        return 'quiz';
      case MIME_TYPE.youtube:
        return 'youtube';
      case MIME_TYPE.webModule:
        return 'web-module';
      case MIME_TYPE.iap:
        return 'iap';
      case MIME_TYPE.handson:
        return 'hands-on';
      default:
        switch (this.content.contentType) {
          case 'Course':
            if (this.content.learningMode === 'Instructor-Led') {
              return 'instructor-led';
            }
            return 'course';
          case 'Learning Path':
            return 'program';
          case 'Collection':
            return 'module';
          case 'Resource':
            return 'resource';
        }
    }
    return 'none';
  }
}
