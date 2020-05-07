/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IContent } from '../models/content.model';
import { IEmailRequest, IEmailResponse, IEmailPlaylistGoalShareRequest, IEmailTextRequest } from '../models/email.model';

import { UserApiService } from '../apis/user-api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(
    private authSvc: AuthService,
    private userApiSvc: UserApiService
  ) { }


  shareTextMail(req: IEmailTextRequest): Observable<IEmailResponse> {
    return this.userApiSvc.shareTextMail(req);
  }

  shareApi(
    content: IContent,
    userMailIds: Array<{ email: string }>,
    txtBody: string,
    type: 'attachment' | 'share' | 'query' = 'share'
  ): Observable<IEmailResponse> {
    const profile: { name: string; email: string } = {
      email: this.authSvc.userEmail,
      name: this.authSvc.userName
    };
    return this.userApiSvc.addShare(
      this.shareRequestBuilder(content, userMailIds, txtBody, profile, type)
    );
  }

  public addShare(req) {
    return this.userApiSvc.addShare(req);
  }

  private shareRequestBuilder(
    content: IContent,
    userMailIds: Array<{ email: string }>,
    txtBody: string,
    user: { name: string; email: string },
    type: 'attachment' | 'share' | 'query'
  ): IEmailRequest {
    return {
      appURL: location.origin,
      artifacts: [
        {
          artifactUrl: content.artifactUrl || '',
          authors: content.creatorContacts,
          description: content.description,
          downloadUrl: content.downloadUrl || '',
          duration: '' + content.duration,
          identifier: content.identifier,
          size: content.size || 0,
          thumbnailUrl: content.appIcon,
          title: content.name,
          track: (content.track || []).map(t => t.name).join(';'),
          url: document.baseURI + `toc/${content.identifier}`
        }
      ],
      body: {
        text: txtBody,
        isHTML: false
      },
      ccTo:
        type === 'attachment'
          ? []
          : [
            {
              name: user.name,
              email: user.email
            }
          ],
      emailTo:
        type === 'attachment'
          ? [
            {
              name: user.name,
              email: user.email
            }
          ]
          : userMailIds,
      emailType: type,
      sharedBy: [
        {
          name: user.name,
          email: user.email
        }
      ],
      timestamp: Date.now()
    };
  }
}
