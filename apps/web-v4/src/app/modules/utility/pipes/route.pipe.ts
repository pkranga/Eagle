/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Pipe, PipeTransform } from '@angular/core';
import { IContent } from '../../../models/content.model';

@Pipe({
  name: 'route'
})
export class RoutePipe implements PipeTransform {
  transform(content: IContent, routeType?: 'continueLearning' | 'forceToc'): string {
    return `/toc/${content.identifier}`;
    //   if (routeType === 'continueLearning' && content.continueLearningData && content.continueLearningData.resourceId) {
    //     if (content.continueLearningData.contextualPathId === content.continueLearningData.resourceId) {
    //       return `/viewer/${content.continueLearningData.contextualPathId}`;
    //     }
    //     return `/viewer/${content.continueLearningData.contextualPathId}/${content.continueLearningData.resourceId}`;
    //   }
    //   const id = content.identifier;
    //   if (routeType === 'forceToc') {
    //     return `/toc/${id}`;
    //   }
    //   if (content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact') {
    //     return `/viewer/${id}`;
    //   } else {
    //     return `/toc/${id}`;
    //   }
  }
}
