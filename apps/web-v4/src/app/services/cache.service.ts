/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { IContent } from '../models/content.model';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  private hierarchyCache = new Map<string, IContent>();
  private cachedData: Map<string, any> = new Map<string, any>();
  constructor() {}
  getContent(contentId: string): IContent | null {
    if (this.hierarchyCache.has(contentId)) {
      return this.hierarchyCache.get(contentId);
    }
    return null;
  }
  cacheTocContent(content: IContent) {
    this.hierarchyCache.set(content.identifier, content);
    if (Array.isArray(content.children)) {
      content.children.forEach(child => {
        this.cacheTocContent(child);
      });
    }
  }

  cacheData(key: string, value) {
    this.cachedData.set(key, value);
  }
  getCachedCopy<T>(key: string): T | null {
    return this.cachedData.get(key) as T;
  }
  hasCachedCopy(key: string): boolean {
    return this.cachedData.has(key);
  }
}
