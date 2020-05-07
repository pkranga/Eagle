/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
export class Impression {
  pageId: string;
  pageEnv: string;
  pageType: string;
  pageUrl: string;
  contentId: string;
  contentName: string;
  constructor(
    pageId: string,
    pageEnv: string = null,
    pageType = 'default',
    contentId?: string,
    contentName?: string
  ) {
    this.pageId = pageId;
    this.pageEnv = pageEnv;
    this.pageType = pageType;
    this.contentId = contentId;
    this.contentName = contentName;
  }
}
