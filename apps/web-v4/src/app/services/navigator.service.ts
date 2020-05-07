/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { NavigatorApiService } from '../apis/navigator-api.service';
import { ContentApiService } from '../apis/content-api.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class NavigatorService {
  navigatorHash: { [key: string]: any };

  constructor(private navigatorApi: NavigatorApiService, private contentApi: ContentApiService, private cacheSvc: CacheService) {
    this.fetchNavigatorData().subscribe();
  }

  fetchNavigatorData(): Observable<any> {
    if (this.navigatorHash) {
      return of(this.navigatorHash);
    }
    return forkJoin([
      this.navigatorApi.fetchNsoData(),
      this.navigatorApi.fetchLearningPathData(),
      this.navigatorApi.fetchDMData(),
      this.navigatorApi.fetchFullstackData(),
      this.navigatorApi.fetchCommonGoalsData(),
      this.navigatorApi.fetchIndustriesData(),
      this.navigatorApi.fetchSubDomainsData(),
      this.navigatorApi.fetchAccountsData(),
      this.navigatorApi.fetchCommonsData(),
      // this.navigatorApi.fetchCdpData(),
      // this.navigatorApi.fetchCdpLpData()
    ]).pipe(
      map(([nso, lp, dm, fs, cg, ind, sd, ac, commons]) => ({
        nso: nso.nso_data,
        lp,
        dm: dm.dm_data,
        fs: fs.fs_data,
        cg: cg.common_goals,
        ind,
        sd,
        ac,
        commons,
      })),
      tap(hash => {
        this.navigatorHash = hash;
      })
    );
  }

  get cdp(): Observable<any[]> {
    if (this.cacheSvc.hasCachedCopy('cdp')) {
      return of(this.cacheSvc.getCachedCopy('cdp'));
    }
    return this.navigatorApi.fetchCdpData().pipe(
      tap(cdp => this.cacheSvc.cacheData('cdp', cdp))
    );
  }

  get cdpLp(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('cdpLp')) {
      return of(this.cacheSvc.getCachedCopy('cdpLp'));
    }
    return this.navigatorApi.fetchCdpLpData().pipe(
      tap(cdpLp => this.cacheSvc.cacheData('cdpLp', cdpLp))
    );
  }

  get nso(): Observable<any[]> {
    if (this.cacheSvc.hasCachedCopy('nso')) {
      return of(this.cacheSvc.getCachedCopy('nso'));
    }
    return this.fetchNavigatorData().pipe(
      map(u => u.nso),
      tap(nso => this.cacheSvc.cacheData('nso', nso))
    );
  }

  get lp(): Observable<any[]> {
    if (this.cacheSvc.hasCachedCopy('lp')) {
      return of(this.cacheSvc.getCachedCopy('lp'));
    }
    return this.fetchNavigatorData().pipe(
      map(u => u.lp),
      tap(lp => this.cacheSvc.cacheData('lp', lp))
    );
  }
  get dm(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('dm')) {
      return of(this.cacheSvc.getCachedCopy('dm'));
    }
    return this.fetchNavigatorData().pipe(
      map(u => u.dm),
      tap(dm => this.cacheSvc.cacheData('dm', dm))
    );
  }
  get fs(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('fs')) {
      return of(this.cacheSvc.getCachedCopy('fs'));
    }
    return this.fetchNavigatorData().pipe(
      map(u => u.fs),
      tap(fs => this.cacheSvc.cacheData('fs', fs))
    );
  }
  get cg(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('cg')) {
      return of(this.cacheSvc.getCachedCopy('cg'));
    }
    return this.fetchNavigatorData().pipe(
      map(u => u.cg),
      tap(cg => this.cacheSvc.cacheData('cg', cg))
    );
  }
  get commons(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('commons')) {
      return of(this.cacheSvc.getCachedCopy('commons'));
    }

    return this.fetchNavigatorData().pipe(
      map(u => this.transformCommonsData(u.commons)),
      tap(commons => this.cacheSvc.cacheData('commons', commons))
    );
  }

  private transformCommonsData(commons) {
    const commonsHash = {};
    commons.goal_data.forEach(goal => {
      commonsHash[goal.lp_id] = goal.goal_id;
    });

    return commonsHash;
  }
  get ind(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('ind')) {
      // console.log(this.cacheSvc.getCachedCopy('ind'), 'cached copy');
      return of(this.cacheSvc.getCachedCopy('ind'));
    }
    return this.fetchNavigatorData().pipe(
      map(u => u.ind),
      tap(ind => this.cacheSvc.cacheData('ind', ind))
    );
  }
  get ac(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('ac')) {
      return of(this.cacheSvc.getCachedCopy('ac'));
    }
    return this.fetchNavigatorData().pipe(
      map(u => u.ac),
      tap(ac => this.cacheSvc.cacheData('ac', ac))
    );
  }
  get dpn(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('dpn')) {
      return of(this.cacheSvc.getCachedCopy('dpn'));
    }
    return this.navigatorApi.fetchDeliveryPartnerData().pipe(
      tap(dpn => {
        if (dpn) {
          this.cacheSvc.cacheData('dpn', dpn);
        }
      })
    );
  }

  get subDomains(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('sd')) {
      return of(this.cacheSvc.getCachedCopy('sd'));
    }
    return this.fetchNavigatorData().pipe(
      map(u => u.sd),
      tap(sd => this.cacheSvc.cacheData('sd', sd))
    );
  }
  get roles(): Observable<any> {
    if (this.cacheSvc.hasCachedCopy('roles')) {
      return of(this.cacheSvc.getCachedCopy('roles'));
    }

    return this.fetchNavigatorData().pipe(
      map(u => {
        const rolesArray = u.nso.map(nso => nso.roles);
        const allRoles = [];
        rolesArray.forEach(roles => {
          roles.forEach(role => {
            allRoles.push(role);
          });
        });
        return allRoles;
      }),
      tap(allRoles => this.cacheSvc.cacheData('roles', allRoles))
    );
  }
  role(roleId: string): Observable<any> {
    try {
      return this.roles.pipe(map(roles => roles.filter(role => role.role_id === roleId)));
    } catch (e) {
      return of([]);
    }
  }
}
