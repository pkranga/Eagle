/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of, BehaviorSubject, from } from 'rxjs';
import { switchMap, map, tap, filter } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

import { IContent } from '../models/content.model';
import { IProjectInfo } from '../models/project.model';
import { IEvent } from '../models/events.model';
import { IEmailResponse, IEmailPlaylistGoalShareRequest } from '../models/email.model';

import { AuthService } from './auth.service';
import { TelemetryService } from './telemetry.service';
import { MiscApiService } from '../apis/misc-api.service';
import { GoalsService } from './goals.service';
import { IInstanceConfigBannerUnit } from '../models/instanceConfig.model';
import { MsAuthService } from './ms-auth.service';

@Injectable({
  providedIn: 'root'
})
export class MiscService {
  public navBarDisplaySubject = new BehaviorSubject<boolean>(true);
  public navBarDisplay$: Observable<boolean> = this.navBarDisplaySubject.pipe(filter(u => u !== null));
  constructor(
    private sanitizer: DomSanitizer,
    private miscApi: MiscApiService,
    private authSvc: AuthService,
    private telemetrySvc: TelemetryService,
    private goalsSvc: GoalsService,
    private msAuthSvc: MsAuthService
  ) { }

  fetchOnboardingData(): Observable<IContent[]> {
    return this.miscApi.fetchOnboardingData();
  }

  // CONCEPT-GRAPH
  fetchConceptGraphTopics(ids: string): Observable<any> {
    return this.miscApi.fetchConceptGraphTopics(ids);
  }

  fetchVideoTokens(
    chId: string,
    vId: string
  ): Observable<{
    streamingToken: string;
    manifest: string;
  }> {
    return from(this.msAuthSvc.getToken(this.authSvc.userEmail)).pipe(
      switchMap(token =>
        forkJoin(this.miscApi.O365Manifest(chId, vId, token), this.miscApi.O365StreamingToken(chId, vId, token))
      ),
      map(([manifest, token]) => ({
        streamingToken: token.value,
        manifest: manifest.value
      }))
    );
  }

  fetchCourseProjects(courseId: string): Observable<IProjectInfo[]> {
    return this.miscApi.fetchCourseProjects(courseId);
  }

  // HOME_BANNERS
  fetchHomeBanners(): Observable<IInstanceConfigBannerUnit[]> {
    return this.miscApi.fetchHomeBanners();
  }

  // SIEMENS_HOME_BANNERS
  fetchSiemensHomeBanners(): Observable<IInstanceConfigBannerUnit[]> {
    return this.miscApi.fetchSiemensHomeBanners();
  }

  // HEALTHINEERS_HOME_BANNERS
  fetchHealthineerHomeBanners(): Observable<IInstanceConfigBannerUnit[]> {
    return this.miscApi.fetchHealthineerHomeBanners();
  }


  fetchLiveEvents(): Observable<IEvent[]> {
    return this.miscApi.fetchLiveEvents();
  }

  shareMail(
    id: string,
    mailIds: string,
    emailType: string,
    mailBody: string,
    item,
    appUrl: string
  ): Observable<IEmailResponse> {
    const name = this.authSvc.userEmail.replace('EMAIL', '').replace('EMAIL', '');
    const email = this.authSvc.userEmail;
    this.telemetrySvc.shareTelemetryEvent(
      id,
      mailIds
        ? mailIds
          .split(';')
          .map(i =>
            i.includes('@') ? i.toLocaleLowerCase().trim() : i.toLocaleLowerCase().trim() + 'EMAIL'
          )
        : [email],
      mailBody,
      item.event,
      item.contentIds
    );
    const req: IEmailPlaylistGoalShareRequest = {
      emailTo: mailIds
        ? mailIds.split(';').map(u => ({
          email: u.includes('@') ? u.toLocaleLowerCase().trim() : u.toLocaleLowerCase().trim() + 'EMAIL'
        }))
        : [{ name, email }],
      emailType,
      sharedBy: [{ name, email }],
      ccTo: [{ name, email }],
      body: {
        text: mailBody,
        isHTML: false
      },
      timestamp: Date.now(),
      appURL: location.origin + appUrl,
      artifact: [
        {
          identifier: item.id,
          title: item.title,
          description: item.desc || null,
          content: item.contentIds
        }
      ]
    };
    return this.goalsSvc.shareGoalOrPlaylist(req);
  }
}
