/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IContent } from '../models/content.model';
import { IProjectInfo } from '../models/project.model';
import { slagV2 } from '../constants/apiEndpoints.constant';
import { IEvent } from '../models/events.model';
import { IInstanceConfigBannerUnit } from '../models/instanceConfig.model';
import { ConfigService } from '../services/config.service';

const apiEndpoints = {
  INFY_RADIO: `${slagV2}/infyradio`,
  PROJECT_FETCH: `${slagV2}/project`, // #GET/:projectId
  PROJECT_COURSE_FETCH: `${slagV2}/project/course`, // #GET/:courseid
  ONBOARDING: `${slagV2}/onboarding`, // #GET
  CONCEPT_GRAPH_FETCH: `${slagV2}/concept`, // #GET/:id
  EVENTS: `${slagV2}/events`,
};
@Injectable({
  providedIn: 'root'
})
export class MiscApiService {
  constructor(private http: HttpClient, private configSvc: ConfigService) { }

  // RADIO
  fetchInfyRadioData(type: string): Observable<IContent[]> {
    return this.http.get<IContent[]>(`${apiEndpoints.INFY_RADIO}?type=${type}`);
  }

  // PROJECTS
  fetchCourseProjects(courseId: string): Observable<IProjectInfo[]> {
    const url = apiEndpoints.PROJECT_COURSE_FETCH + '/' + courseId;
    return this.http.get<any>(url).pipe(
      map(response => {
        try {
          return response.map(data => data._source.doc) || [];
        } catch (e) {
          return [];
        }
      })
    );
  }
  fetchProjectDetails(projectId: string): Observable<any> {
    const url = apiEndpoints.PROJECT_FETCH + '/' + projectId;
    return this.http.get<any>(url);
  }

  // ONBOADRING
  fetchOnboardingData(): Observable<IContent[]> {
    return this.http.get<IContent[]>(apiEndpoints.ONBOARDING);
  }

  // CONCEPT-GRAPH
  fetchConceptGraphTopics(ids: string): Observable<any> {
    return this.http.get(`${apiEndpoints.CONCEPT_GRAPH_FETCH}/${ids}`);
  }

  // EVENTS
  fetchLiveEvents(): Observable<IEvent[]> {
    return this.http.get<IEvent[]>(`${apiEndpoints.EVENTS}`);
  }

  // SIEMENS_HOME_BANNERS
  fetchSiemensHomeBanners(): Observable<IInstanceConfigBannerUnit[]> {
    return this.http.get<IInstanceConfigBannerUnit[]>(this.configSvc.instanceConfig.features.home.config.bannerConfig.shomeBannerJsonPath);
  }

  // HEALTHINEERS_HOME_BANNERS
  fetchHealthineerHomeBanners(): Observable<IInstanceConfigBannerUnit[]> {
    return this.http.get<IInstanceConfigBannerUnit[]>(this.configSvc.instanceConfig.features.home.config.bannerConfig.hhomeBannerJsonPath);
  }

  // HOME_BANNERS
  fetchHomeBanners(): Observable<IInstanceConfigBannerUnit[]> {
    return this.http.get<IInstanceConfigBannerUnit[]>(this.configSvc.instanceConfig.features.home.config.bannerConfig.homeBannerJsonPath);
  }


  // Video Player
  O365StreamingToken(chId: string, vId: string, token: string): Observable<{ value: string }> {
    return this.http.get<{ value: string }>(
      // tslint:disable-next-line
      `https://infosystechnologies.sharepoint.com/portals/hub/_api/VideoService/Channels('${chId}')/Videos('${vId}')/GetStreamingKeyAccessToken`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    );
  }
  O365Manifest(chId: string, vId: string, token: string): Observable<{ value: string }> {
    return this.http.get<{ value: string }>(
      `https://infosystechnologies.sharepoint.com/portals/hub/_api/VideoService/Channels('${chId}')/Videos('${vId}')/GetPlaybackUrl('1')`,
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    );
  }
}
