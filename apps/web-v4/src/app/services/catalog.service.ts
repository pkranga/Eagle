/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ICatalog } from '../models/catalog.model';

import { ContentApiService } from '../apis/content-api.service';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  constructor(private contentApi: ContentApiService, private cacheSvc: CacheService) { }

  fetchCatalog(): Observable<ICatalog> {
    const catalog: ICatalog = this.cacheSvc.getCachedCopy('catalog');
    if (catalog) {
      return of(catalog);
    }
    return this.contentApi.fetchCatalog().pipe(
      tap(data => {
        this.cacheSvc.cacheData('catalog', data);
      })
    );
  }

  fetchPentagon(): Observable<any> {
    return this.getFilter(['Pentagon']).pipe(
      map(
        response =>
          response.filters.find(child => child.type === 'tags').content.find(child => child.type === 'Pentagon'))
    );
    // return this.fetchCatalog().pipe(map(catalog => catalog.children[0].children.find(child => child.value === 'Pentagon')));
  }

  fetchMarketing(): Observable<ICatalog> {
    return this.fetchCatalog().pipe(map(catalog => catalog.children[0].children.find(child => child.value === 'Marketing')));
  }

  fetchOnboarding(): Observable<ICatalog> {
    return this.fetchCatalog().pipe(map(catalog => catalog.children[0].children.find(child => child.value === 'Onboarding')));
  }

  fetchIndustries(): Observable<any> {
    return this.getFilter(['Marketing/Industries']).pipe(
      map(
        response =>
          this.transformResponse(response, 'Marketing/Industries')
      )
    );
    // return this.fetchMarketing().pipe(map(catalog => catalog.children.find(child => child.value === 'Industries')));
  }

  fetchProducts(): Observable<any> {
    return this.getFilter(['Marketing/Products & Subsidiaries']).pipe(
      map(
        response => this.transformResponse(response, 'Marketing/Products & Subsidiaries')
      )
    );
  }

  getPath(catalog: ICatalog, id: string): ICatalog[] {
    const path: ICatalog[] = [];
    this.hasPath(catalog, path, id);
    return path;
  }

  getFilter(tags: string[]) {
    return this.contentApi.search({
      query: 'all',
      pageNo: 0,
      pageSize: 0,
      filters: {
        tags,
        resourceCategory: ['Prepare', 'Leave Behind', 'Engage'],
        contentType: ['Resource']
      }
    });
  }

  private transformResponse(response, type: string) {
    const tags = response.filters.find(child => child.type === 'tags');
    if (tags) {
      const content = tags.content;
      if (content) {
        const marketing = content.find(child => child.type === 'Marketing');
        if (marketing) {
          const children = marketing.children;
          if (children) {
            return children.find(child => child.type === type);
          }
        }
      }
    }

    return [];
  }
  private hasPath(node: ICatalog, pathArr: ICatalog[], id: string): boolean {
    if (node == null) {
      return false;
    }
    pathArr.push(node);
    if (node.identifier === id) {
      return true;
    }
    const children = node.children || [];
    if (children.some(u => this.hasPath(u, pathArr, id))) {
      return true;
    }
    pathArr.pop();
    return false;
  }
}
