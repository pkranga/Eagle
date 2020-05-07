/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { WidgetBaseComponent } from '../widget-base.component'
@Component({
  selector: 'ws-resolver-invalid-permission',
  templateUrl: './invalid-permission.component.html',
  styleUrls: ['./invalid-permission.component.scss'],
})
export class InvalidPermissionComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<any> {
  @Input() widgetType!: string
  @Input() widgetSubType!: string
  @Input() widgetInstanceId?: string
  @Input() widgetData!: any
  showData = true

  ngOnInit() {}
}
