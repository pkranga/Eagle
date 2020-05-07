/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { ICatalog } from '../models/catalog.model';
import { Observable } from 'rxjs';
import { CatalogService } from '../services/catalog.service';

@Injectable()
export class CatalogResolve implements Resolve<ICatalog> {
  constructor(private catalogSvc: CatalogService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ICatalog> | Promise<ICatalog> | ICatalog {
    return this.catalogSvc.fetchCatalog();
  }
}
