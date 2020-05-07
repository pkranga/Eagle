/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { fromEvent, Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { IContent, ICreator } from '../../../models/content.model';
import { IUserProfileGraph } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

interface WindowYammerModified extends Window {
  yam?: any;
}
declare var window: WindowYammerModified;

@Injectable({
  providedIn: 'root'
})
export class TocService {
  private hasYamScriptLoaded = false;
  constructor(private userSvc: UserService) {}

  fetchCreators(creators: ICreator[]): Observable<IUserProfileGraph[]> {
    return this.userSvc.fetchMultipleUserGraphProfile(creators.map(creator => creator.email)).pipe(
      map(res => {
        const creatorsResponse = res;
        const creatorsResult: IUserProfileGraph[] = [];
        creators.forEach(creator => {
          const creatorEmail = creator.email.split('@')[0].toLowerCase();
          const creatorInResponse = creatorsResponse.filter(
            creatorRespo => creatorRespo.onPremisesUserPrincipalName.split('@')[0].toLowerCase() === creatorEmail
          );
          if (creatorInResponse && creatorInResponse.length) {
            creatorsResult.push(creatorInResponse[0]);
          } else {
            creatorsResult.push({
              city: '',
              department: '',
              givenName: creator.name,
              surname: '',
              jobTitle: '',
              mobilePhone: '',
              onPremisesUserPrincipalName: creator.email,
              usageLocation: ''
            });
          }
        });
        return creatorsResult;
      })
    );
  }

  scriptSetup(): Observable<boolean> {
    if (window.yam || this.hasYamScriptLoaded) {
      return of(true);
    }
    const elem = document.getElementById('yamScript');
    if (elem) {
      return fromEvent(elem, 'load').pipe(
        tap(() => {
          this.hasYamScriptLoaded = true;
        }),
        map(() => true)
      );
    }

    const yamScript = document.createElement('script');
    yamScript.setAttribute('id', 'yamScript');
    yamScript.setAttribute('src', 'https://c64.assets-yammer.com/assets/platform_embed.js');
    document.body.appendChild(yamScript);
    return fromEvent(yamScript, 'load').pipe(
      tap(() => {
        this.hasYamScriptLoaded = true;
      }),
      map(() => true)
    );
  }

  getFirstChildInHierarchy(content: IContent): IContent {
    if (!(content.children || []).length) {
      return content;
    }
    // || content.learningMode === 'Classroom'
    if (content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact') {
      return content;
    } else {
      content = content.children[0];
      content = this.getFirstChildInHierarchy(content);
    }
    return content;
  }
}
