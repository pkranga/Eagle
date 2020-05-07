/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { UserApiService } from '../apis/user-api.service';
import { AccessControlApiService } from '../apis/access-control-api.service';

@Injectable({
  providedIn: 'root'
})
export class AccessControlService {
  private userRolesNotifier: BehaviorSubject<Set<string>> = null;
  private userRoles: Set<string>;
  constructor(private userApiSvc: UserApiService, private accessControlApiSvc: AccessControlApiService) { }

  getUserRoles(): Observable<Set<string>> {
    if (this.userRolesNotifier === null) {
      this.userRolesNotifier = new BehaviorSubject(null);
      this.fetchUserRoles();
    }
    return this.userRolesNotifier.pipe(filter(roles => roles !== null));
  }
  fetchUserRoles() {
    if (this.userRoles) {
      this.userRolesNotifier.next(this.userRoles);
      return;
    }
    this.userApiSvc.fetchUserRoles().subscribe(data => {
      this.userRoles = data;
      this.userRolesNotifier.next(this.userRoles);
    });
  }
  checkContentAccess(contentIds: string[]): Observable<{ [id: string]: { hasAccess: boolean } }> {
    return this.accessControlApiSvc.checkContentAccess(contentIds);
  }
}
