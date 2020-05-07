/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { map } from 'rxjs/operators'
import {
  CONTENT_CREATE,
} from '@ws/author/src/lib/constants/apiEndpoints'
import { Observable } from 'rxjs'
import { ApiService } from '@ws/author/src/lib/modules/shared/services/api.service'
import { NSApiRequest } from '@ws/author/src/lib/interface/apiRequest'
import { NSApiResponse } from '@ws/author/src/lib/interface//apiResponse'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'

@Injectable()
export class CreateService {

  constructor(
    private apiService: ApiService,
    private accessService: AccessControlService,
  ) {
  }

  create(meta: { mimeType: string, contentType: string, locale: string }): Observable<string> {
    const requestBody: NSApiRequest.ICreateMetaRequest = {
      content: {
        ...meta,
        name: 'Untitled Content',
        description: '',
        createdBy: this.accessService.userId,
      },
    }
    return this.apiService.post<NSApiRequest.ICreateMetaRequest>(
      `${CONTENT_CREATE}${this.accessService.orgRootOrgAsQuery}`, requestBody,
    ).pipe(
      map((data: NSApiResponse.IContentCreateResponse) => {
        return data.identifier
      }),
    )
  }

}
