/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Pipe, PipeTransform } from '@angular/core'
import { NsContent } from '../../_services/widget-content.model'
import { ConfigurationsService, EInstance } from '@ws-widget/utils'
@Pipe({
  name: 'pipeContentRoute',
})
export class PipeContentRoutePipe implements PipeTransform {

  constructor(
    private configSvc: ConfigurationsService,
  ) { }

  transform(content: NsContent.IContent): { url: string, queryParams: { [key: string]: any } } {
path
      return {
        url: `/app/toc/knowledge-artifact/${content.identifier}`,
        queryParams: this.getQueryParams(),
      }
    }
    if (content.contentType === 'Knowledge Board') {
      return {
        url: `/app/knowledge-board/${content.identifier}`,
        queryParams: this.getQueryParams(),
      }
    }
    if (content.contentType === 'Channel') {
      return {
        url: `/page/${content.identifier}`,
        queryParams: this.getQueryParams(),
      }
    }
    if (content.contentType === 'Learning Journeys') {
      if (content.resourceType === 'Dynamic Learning Paths') {
        return {
          url: `/app/learning-journey/dlp/${content.identifier}/0`,
          queryParams: this.getQueryParams(),
        }
      }
      return {
        url: `/app/learning-journey/cdp/${content.identifier}`,
        queryParams: this.getQueryParams(),
      }
    }
    return {
      url: `/app/toc/${content.identifier}/overview`,
      queryParams: this.getQueryParams(),
    }
  }

  private getQueryParams() {
    return {}
  }

}
