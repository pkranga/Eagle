/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';

import { ResponsiveImageSrcDirective } from './responsive-image-src.directive';
import { DefaultImageDirective } from './default-image.directive';
import { HasPermissionDirective } from './has-permission.directive';

@NgModule({
  declarations: [
    ResponsiveImageSrcDirective,
    DefaultImageDirective,
    HasPermissionDirective
  ],
  exports: [
    ResponsiveImageSrcDirective,
    DefaultImageDirective,
    HasPermissionDirective
  ],
  imports: [CommonModule, LayoutModule]
})
export class CustomDirectivesModule {}
