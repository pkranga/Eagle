/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IContent, IValidResource } from '../../../../models/content.model';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { ContentService } from '../../../../services/content.service';
import { TocService } from '../../services/toc.service';
import { IUserProfileGraph } from '../../../../models/user.model';
import { FetchStatus } from '../../../../models/status.model';
import { ConfigService } from '../../../../services/config.service';

interface ProgramStructure {
  document: number;
  video: number;
  podcast: number;
  quiz: number;
  assessment: number;
  youtube: number;
  'learning-module': number;
  course: number;
  'web-module': number;
  handson: number;
  other: number;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  @Input() content: IContent;
  conceptGraphFeatureStatus = this.configSvc.instanceConfig.features.conceptGraph.enabled;
  isProfileSupported = this.configSvc.instanceConfig.features.toc.subFeatures.cohorts.subFeatures.isProfileSupported;
  programStructure: ProgramStructure;
  isValidProgStructure = false;
  viewMoreTopics = false;
  validResource: IValidResource;
  authors: IUserProfileGraph[] = [];
  authorFetchingStatus: FetchStatus;
  authorAvailable = this.configSvc.instanceConfig.features.client.available;
  missingThumbnail = this.configSvc.instanceConfig.platform.thumbnailMissingLogo;
  authorLabel = this.configSvc.instanceConfig.features.toc.subFeatures.authors.config.title;

  constructor(private contentSvc: ContentService, private tocSvc: TocService, private configSvc: ConfigService) { }

  ngOnInit() {
    this.checkIfResourceExists(this.content);
    this.fetchAuthors();
    this.programStructure = this.updateProgramStructure(this.content, {
      document: 0,
      video: 0,
      podcast: 0,
      quiz: 0,
      assessment: 0,
      youtube: 0,
      'learning-module': this.content.contentType === 'Collection' ? -1 : 0,
      course: this.content.contentType === 'Course' ? -1 : 0,
      'web-module': 0,
      handson: 0,
      other: 0
    });
    for (const progType in this.programStructure) {
      if (this.programStructure[progType] > 0) {
        this.isValidProgStructure = true;
        break;
      }
    }
  }

  private updateProgramStructure(content: IContent, progStruc: ProgramStructure): ProgramStructure {
    if (content && !(content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact')) {
      if (content.contentType === 'Course') {
        progStruc.course += 1;
      } else if (content.contentType === 'Collection') {
        progStruc['learning-module'] += 1;
      }
      content.children.forEach(child => {
        progStruc = this.updateProgramStructure(child, progStruc);
      });
    } else if (content && (content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact')) {
      switch (content.mimeType) {
        case MIME_TYPE.quiz:
          if (content.resourceType === 'Assessment') {
            progStruc.assessment += 1;
          } else {
            progStruc.quiz += 1;
          }
          break;
        case MIME_TYPE.mp4:
          progStruc.video += 1;
          break;
        case MIME_TYPE.youtube:
          progStruc.youtube += 1;
          break;
        case MIME_TYPE.pdf:
          progStruc.document += 1;
          break;
        case MIME_TYPE.mp3:
          progStruc.podcast += 1;
          break;
        case MIME_TYPE.webModule:
          progStruc['web-module'] += 1;
          break;
        case MIME_TYPE.handson:
          progStruc.handson += 1;
          break;
        default:
          progStruc.other += 1;
          break;
      }
      return progStruc;
    }
    return progStruc;
  }

  private fetchAuthors() {
    this.authorFetchingStatus = 'fetching';
    this.tocSvc.fetchCreators(this.content.creatorContacts).subscribe(
      data => {
        this.authorFetchingStatus = 'done';
        this.authors = data || [];
      },
      err => {
        this.authorFetchingStatus = 'done';
        this.content.creatorContacts.forEach(creator => {
          this.authors.push({
            city: '',
            department: '',
            givenName: creator.name,
            surname: '',
            jobTitle: '',
            mobilePhone: '',
            onPremisesUserPrincipalName: creator.email,
            usageLocation: ''
          });
        });
      }
    );
  }

  private checkIfResourceExists(content: IContent) {
    let preContentArray: string[] = [];
    let postContentArray: string[] = [];
    if (content.preContents && content.preContents.length) {
      preContentArray = content.preContents.map(v => v.identifier);
    }
    if (content.postContents && content.postContents.length) {
      postContentArray = content.postContents.map(v => v.identifier);
    }
    const concatenatedArray = preContentArray.concat(postContentArray);
    const request = {
      Ids: concatenatedArray.filter((item, pos) => concatenatedArray.indexOf(item) === pos)
    };
    if (request.Ids.length) {
      this.contentSvc.validResourceCheck(request).subscribe((result: IValidResource) => {
        this.validResource = result;
      });
    }
  }
}
