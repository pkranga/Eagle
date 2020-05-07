/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { WidgetEditorBaseComponent } from '@ws/author/src/lib/routing/modules/editor/routing/modules/page/interface/component'
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { IWidgetElementHtml } from '@ws-widget/collection/src/public-api'

@Component({
  selector: 'ws-auth-breadcrum',
  templateUrl: './breadcrum.component.html',
  styleUrls: ['./breadcrum.component.scss'],
})
export class BreadcrumComponent extends WidgetEditorBaseComponent<IWidgetElementHtml> implements OnInit {

  @Input() identifier!: string
  @Input() widgerData!: IWidgetElementHtml
  @Output() data = new EventEmitter<IWidgetElementHtml>()
  constructor() {
    super()
  }

  ngOnInit() {
  }

}
