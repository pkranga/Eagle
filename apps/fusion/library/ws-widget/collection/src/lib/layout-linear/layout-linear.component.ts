/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'

interface ILinearWidgets {
  widgets: NsWidgetResolver.IRenderConfigWithAnyData[]
}
@Component({
  selector: 'ws-widget-layout-linear',
  templateUrl: './layout-linear.component.html',
  styleUrls: ['./layout-linear.component.scss'],
})
export class LayoutLinearComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<ILinearWidgets> {
  @Input() widgetData!: ILinearWidgets

  ngOnInit() {}
}
