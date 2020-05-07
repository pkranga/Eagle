/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { WidgetContentService } from '../_services/widget-content.service'
import { ConfigurationsService } from '@ws-widget/utils'
import { HttpClient } from '@angular/common/http'
import { NsContent } from '../_services/widget-content.model'

const API_END_POINTS = {
  updateHierarchy: `/apis/protected/v8/content/hierarchy/update`,
  editKBDetails: `/apis/protected/v8/content/kb`,
  getFollowers: `/apis/protected/v8/user/follow/getFollowers`,

}

@Injectable({
  providedIn: 'root',
})
export class BtnKbService {
  constructor(
    private contentSvc: WidgetContentService,
    private configSvc: ConfigurationsService,
    private http: HttpClient,
  ) { }

  getMyKnowledgeBoards() {
    return this.contentSvc.search({
      filters: {
        contentType: [NsContent.EContentTypes.KNOWLEDGE_BOARD],
        creatorContacts: [(this.configSvc.userProfile && this.configSvc.userProfile.userId) || ''],
      },
      pageSize: 30,
    })
  }

  addContentToKb(kbId: string, children: { identifier: string; reason: string | undefined }[]) {
    return this.http.post(API_END_POINTS.updateHierarchy, {
      nodesModified: {},
      hierarchy: {
        [kbId]: {
          children,
          root: true,
        },
      },
    })
  }
  addContentsToKb(req: any) {
    return this.http.post(`${API_END_POINTS.updateHierarchy}`, req)
  }

  editKBBoards(req: any, type: string) {
    return this.http.post(`${API_END_POINTS.editKBDetails}/${type}`, req)
  }

  getFollowers(id: string) {
    return this.http.post(`${API_END_POINTS.getFollowers}`, { id })
  }

}
