/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { KhubApiService } from '../apis/khub-api.service';
import {
  IKhubResult,
  IKhubViewResult,
  IKnowGraphVis,
  IKnowledgeGraph,
  ISearchObj,
  ISearchObjForSearch,
  ISearchObjForView,
  ItemTile,
  ITopicTaggerAction,
  ITopicTaggerResponse
} from '../models/khub.model';

/**
 * CODE_REVIEW:
 * 1. Assignment in conditional statements
 * 2. redundant-code: Browser data already available in Utility Service.
 *    If extra data / fields are required update there and use it
 */

@Injectable({
  providedIn: 'root'
})
export class KhubService {
  item: ItemTile;
  constructor(private khubApiSvc: KhubApiService) {}

  fetchTimelineData(request: ISearchObj): Observable<IKhubResult> {
    return this.khubApiSvc.fetchPersonalizedData(request);
  }
  fetchSearchData(request: ISearchObjForSearch): Observable<IKhubViewResult> {
    return this.khubApiSvc.fetchSearchData(request);
  }

  fetchViewData(request: ISearchObjForView): Observable<any> {
    return this.khubApiSvc.fetchViewData(request);
  }

  fetchMoreLikeThis(request: ISearchObjForView): Observable<any> {
    return this.khubApiSvc.fetchMoreRecs(request);
  }

  fetchKnowData(request: IKnowGraphVis): Observable<IKnowledgeGraph> {
    return this.khubApiSvc.fetchVisData(request);
  }

  postTopicTaggerAction(request: ITopicTaggerAction): Observable<ITopicTaggerResponse> {
    return this.khubApiSvc.postTopicTagger(request);
  }

  setTiles(response: Array<any>) {
    try {
      const tiles = [];
      response.map(cur => {
        const tile = new ItemTile();
        tile.author = cur.authors || [];
        tile.category = cur.category || '';
        tile.description = cur.description || '';
        tile.itemId = cur.itemid || cur.itemId || cur.ItemId || '';
        tile.itemType = cur.itemType || cur.mstServiceOffering || '';
        tile.noOfViews = cur.noOfViews || '';
        tile.restricted = cur.isAccessRestricted || 'N';
        tile.source = cur.source || 'PROMT';
        tile.title = cur.title || cur.mstProjectName || '';
        tile.topics = cur.topics || cur.TopicList || [];
        tile.url = cur.url || '';
        tile.dateCreated = cur.dateCreated
          ? new Date(cur.dateCreated)
          : cur.datecreated
          ? new Date(cur.datecreated)
          : new Date();
        tile.projectScope = cur.mstProjectScope || null;
        tile.businessContext = cur.mstBusinessContext || null;
        tile.color =
          tile.source.toLowerCase() === 'kshop'
            ? '3px solid #f26522'
            : tile.source.toLowerCase() === 'automationcentral'
            ? '3px solid #28a9b2'
            : '3px solid #e94a48';
        tile.pm = cur.pm || [];
        tile.dm = cur.dm || [];
        tile.objectives = cur.mstInfyObjectives || null;
        tile.risks = cur.risks || [];
        tile.contribution = cur.contributions || '';
        tile.sourceId = cur.sourceId || 0;
        tiles.push(tile);
      });
      // console.log(tiles);
      return tiles;
    } catch (e) {
      throw e;
    }
  }

  setMarketing(response: Array<any>) {
    try {
      const tiles = [];
      response.map(cur => {
        const tile = new ItemTile();
        const year = cur.lastUpdatedOn.slice(0, 4);
        const month = cur.lastUpdatedOn.slice(4, 6);
        const date = cur.lastUpdatedOn.slice(6, 8);
        tile.author = cur.creatorDetails || [];
        tile.pm = [];
        tile.category = '';
        tile.description = cur.learningObjective;
        tile.itemId = cur.identifier || 0;
        tile.itemType = '';
        tile.noOfViews = 0;
        tile.restricted = 'N';
        tile.source = 'Marketing';
        tile.title = cur.name || '';
        tile.topics = [];
        tile.url = cur.url || '';
        tile.dateCreated = new Date(year, month, date);
        tile.color = '3px solid #e91e63';
        tile.objectives = null;
        tile.risks = [];
        tile.contribution = [];
        tiles.push(tile);
      });
      // console.log(tiles);
      return tiles;
    } catch (e) {
      throw e;
    }
  }

  setSelectedItem(setItem: ItemTile) {
    try {
      this.item = setItem;
      return true;
    } catch (e) {
      throw e;
    }
  }
  getSelectedItem() {
    try {
      if (this.item !== undefined) {
        return this.item;
      }
    } catch (e) {
      throw e;
    }
  }
  detectBrowser() {
    try {
      const userAgent = navigator.userAgent;
      let browserName = navigator.appName;
      let fullVersion = '' + parseFloat(navigator.appVersion);
      let majorVersion = parseInt(navigator.appVersion, 10);
      let nameOffset;
      let verOffset = 0;
      let ix;

      // In Opera, the true version is after "Opera" or after "Version"
      if ((verOffset = userAgent.indexOf('Opera')) !== -1) {
        browserName = 'Opera';
        fullVersion = userAgent.substring(verOffset + 6);
        if ((verOffset = userAgent.indexOf('Version')) !== -1) {
          fullVersion = userAgent.substring(verOffset + 8);
        }
      } else if ((verOffset = userAgent.indexOf('MSIE')) !== -1) {
        browserName = 'Microsoft Internet Explorer';
        fullVersion = userAgent.substring(verOffset + 5);
      } else if ((verOffset = userAgent.indexOf('Chrome')) !== -1) {
        browserName = 'Chrome';
        fullVersion = userAgent.substring(verOffset + 7);
      } else if ((verOffset = userAgent.indexOf('Safari')) !== -1) {
        browserName = 'Safari';
        fullVersion = userAgent.substring(verOffset + 7);
        if ((verOffset = userAgent.indexOf('Version')) !== -1) {
          fullVersion = userAgent.substring(verOffset + 8);
        }
      } else if ((verOffset = userAgent.indexOf('Firefox')) !== -1) {
        browserName = 'Firefox';
        fullVersion = userAgent.substring(verOffset + 8);
      } else if ((nameOffset = userAgent.lastIndexOf(' ') + 1) < (verOffset = userAgent.lastIndexOf('/'))) {
        browserName = userAgent.substring(nameOffset, verOffset);
        fullVersion = userAgent.substring(verOffset + 1);
        if (browserName.toLowerCase() === browserName.toUpperCase()) {
          browserName = navigator.appName;
        }
      }
      // trim the fullVersion string at semicolon/space if present
      if ((ix = fullVersion.indexOf(';')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }
      if ((ix = fullVersion.indexOf(' ')) !== -1) {
        fullVersion = fullVersion.substring(0, ix);
      }

      majorVersion = parseInt('' + fullVersion, 10);
      if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
      }
      return {
        browserName,
        fullVersion,
        majorVersion,
        appName: navigator.appName,
        userAgent: navigator.userAgent
      };
    } catch (e) {
      console.error(e);
    }
  }
}
