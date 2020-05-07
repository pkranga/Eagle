/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SelectorResponsiveComponent } from './selector-responsive.component'
import { LayoutModule } from '@angular/cdk/layout'
import { WidgetResolverModule } from '@ws-widget/resolver'

@NgModule({
  declarations: [SelectorResponsiveComponent],
  imports: [CommonModule, LayoutModule, WidgetResolverModule],
  exports: [SelectorResponsiveComponent],
  entryComponents: [SelectorResponsiveComponent],
})
export class SelectorResponsiveModule {}
