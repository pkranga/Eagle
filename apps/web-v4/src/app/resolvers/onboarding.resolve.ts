/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { CatalogService } from '../services/catalog.service';
import { map, tap } from 'rxjs/operators';
import { IBannerWithContentStripsData, IInstanceSearchObj, IInstanceConfigContentStrip } from '../models/instanceConfig.model';
import { ConfigService } from '../services/config.service';
import { ICatalog } from '../models/catalog.model';

@Injectable()
export class OnboardingResolve implements Resolve<any> {
  constructor(private catalogSvc: CatalogService, private configSvc: ConfigService) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IBannerWithContentStripsData> | Promise<IBannerWithContentStripsData> | IBannerWithContentStripsData {
    return this.catalogSvc.fetchOnboarding().pipe(
      map(
        (catalog: ICatalog): IBannerWithContentStripsData => ({
          title: 'Onboarding',
          banner: this.configSvc.instanceConfig.features.onboarding.config.banner,
          strips: catalog ? catalog.children.map(
            (child: ICatalog): IInstanceConfigContentStrip => ({
              title: child.value,
              searchQuery: {
                sortBy: 'lastUpdatedOn',
                sortOrder: 'DESC',
                isStandAlone: true,
                filters: {
                  tags: ['Onboarding/' + child.value]
                },
                pageNo: 0,
                query: ''
              },
              searchRedirection: {
                f: {
                  tags: ['Onboarding/' + child.value]
                }
              }
            })
          ) : null
        })
      ),
      tap(u => {
        console.log('onboardinngresolve', u);
      })
    );
  }
}
