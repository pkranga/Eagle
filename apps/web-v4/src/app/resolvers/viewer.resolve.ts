/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ViewerService } from '../services/viewer.service';
import { IContent, IContinueStrip, TFilterCategory } from '../models/content.model';
import { ContentService } from '../services/content.service';
import { HistoryApiService } from '../apis/history-api.service';
import { UtilityService } from '../services/utility.service';
import { ValidPracticeResources, ValidAssessmentResources } from '../constants/content.constants';
import { AuthService } from '../services/auth.service';
import { MsAuthService } from '../services/ms-auth.service';

export interface IViewerResolve {
  toc: IContent;
  content: IContent;
  error?: string;
}

@Injectable()
export class ViewerResolve implements Resolve<IViewerResolve> {
  constructor(
    private viewerSvc: ViewerService,
    private contentSvc: ContentService,
    private historySvc: HistoryApiService,
    private utilSvc: UtilityService,
    private authSvc: AuthService,
    private msAuthSvc: MsAuthService
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IViewerResolve> {
    const contentId = route.paramMap.get('contentId');
    const resourceId = route.paramMap.get('resourceId');
    const filterCategory: TFilterCategory | string = route.queryParamMap.has('filterCategory')
      ? route.queryParamMap.get('filterCategory').toLowerCase()
      : 'all';
    try {
      const toc = await this.getToc(contentId || resourceId, filterCategory);
      const content = await this.getContentToPlay(toc, resourceId);
      if (content.SSOEnabled) {
        this.msAuthSvc.loginForSSOEnabledEmbeds(this.authSvc.userEmail);
      }
      // console.log('toc & content >', toc, content);
      return { toc, content };
    } catch (error) {
      return { toc: null, content: null };
    }
  }

  private async getContentToPlay(toc: IContent, resourceId: string): Promise<IContent> {
    if (toc.contentType === 'Resource' || toc.contentType === 'Knowledge Artifact') {
      return toc;
    } else if (toc.identifier === resourceId) {
      return this.getTheResourceToPlayFromACollection(toc);
    } else {
      // get the resource from IContent
      const resource = this.utilSvc.getNode(toc, resourceId);
      if (resource.contentType === 'Resource' || resource.contentType === 'Knowledge Artifact') {
        return resource;
      }
      return this.getTheResourceToPlayFromACollection(resource);
      // check if its resource : return it, else again get it from history API
    }
  }

  private async getTheResourceToPlayFromACollection(toc: IContent): Promise<IContent> {
    try {
      const resourceToLoad: IContinueStrip = await this.historySvc
        .fetchContentContinueLearning(toc.identifier)
        .toPromise();
      if (
        resourceToLoad &&
        Array.isArray(resourceToLoad.results) &&
        resourceToLoad.results.length > 0 &&
        resourceToLoad.results[0].continueLearningData
      ) {
        const resourceNode = this.utilSvc.getNode(toc, resourceToLoad.results[0].continueLearningData.resourceId);
        if (resourceNode) {
          return resourceNode;
        }
      }
    } catch (err) {}
    while (toc.contentType.toLowerCase() !== 'resource' && toc.children.length > 0) {
      toc = toc.children[0];
    }
    return toc;
  }

  private async getToc(contentId: string, filterCategory: TFilterCategory | string = 'all'): Promise<IContent> {
    // Below if for dummy data for interactive video
    if (contentId === 'INTERACTIVE_VIDEO') {
      console.log('DUMMY: HERE IN VIEWER RESOLVE');
      const data = await this.contentSvc
        .fetchDataFromUrl('/public-assets/common/samples/interactiveVideo/interactiveVideoContent.json')
        .toPromise();
      return data;
    }
    const content = await this.contentSvc.fetchContent(contentId).toPromise();
    if (!filterCategory || filterCategory === 'all') {
      return content;
    }
    const filteredToc = this.filterToc(content, filterCategory || 'all');
    // console.log('filteredToc', filteredToc);
    return filteredToc;
  }

  filterToc(content: IContent, filterCategory: TFilterCategory | string = 'all'): IContent {
    if (content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact') {
      return this.filterUnitContent(content, filterCategory) ? content : null;
    } else {
      const filteredChildren = content.children
        .map(unitContent => this.filterToc(unitContent, filterCategory))
        .filter(unitContent => Boolean(unitContent));

      if (filteredChildren.length) {
        return {
          ...content,
          children: filteredChildren
        };
      }
      return null;
    }
  }

  filterUnitContent(content: IContent, filterCategory: TFilterCategory | string = 'all'): boolean {
    switch (filterCategory) {
      case 'all':
        return true;
      case 'learn':
        return !ValidPracticeResources.has(content.resourceType) && !ValidAssessmentResources.has(content.resourceType);
      case 'practice':
        return ValidPracticeResources.has(content.resourceType);
      case 'assess':
        return ValidAssessmentResources.has(content.resourceType);
      default:
        return true;
    }
  }
}
