/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
// api service imports
import { HistoryApiService } from '../apis/history-api.service';
// constant imports
import { ValidAssessmentResources, ValidPracticeResources } from '../constants/content.constants';
// model imports
import { IContent, IContinueStrip, TFilterCategory } from '../models/content.model';
// service imports
import { AuthService } from '../services/auth.service';
import { ContentService } from '../services/content.service';
import { MsAuthService } from '../services/ms-auth.service';
import { PlayerDataService } from '../services/player-data.service';
import { UtilityService } from '../services/utility.service';
import { ViewerService } from '../services/viewer.service';

export interface IPlayerResolve {
  toc: IContent;
  content: IContent;
  error?: string;
  type: string;
}
@Injectable()
export class PlayerResolve implements Resolve<IPlayerResolve> {
  constructor(
    private playerDataSvc: PlayerDataService,
    private router: Router,
    private viewerSvc: ViewerService,
    private contentSvc: ContentService,
    private historySvc: HistoryApiService,
    private utilSvc: UtilityService,
    private authSvc: AuthService,
    private msAuthSvc: MsAuthService
  ) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<IPlayerResolve> {
    const contentId = route.paramMap.get('contentId');
    const resourceId = route.paramMap.get('resourceId');
    const type = 'content';
    const filterCategory: TFilterCategory | string = route.queryParamMap.has('filterCategory')
      ? route.queryParamMap.get('filterCategory').toLowerCase()
      : 'all';
    try {
      const toc = await this.getToc(contentId || resourceId, filterCategory);
      const content = await this.getContentToPlay(toc, resourceId);
      if (content.SSOEnabled) {
        this.msAuthSvc.loginForSSOEnabledEmbeds(this.authSvc.userEmail);
      }
      this.playerDataSvc.data = { toc, content, type };
      return { toc, content, type };
    } catch (error) {
      return { toc: null, content: null, type };
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
