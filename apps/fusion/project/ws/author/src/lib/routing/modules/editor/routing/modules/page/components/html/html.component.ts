/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { CONTENT_BASE_WEBHOST_ASSETS } from '@ws/author/src/lib/constants/apiEndpoints'
import { WidgetEditorBaseComponent } from '@ws/author/src/lib/routing/modules/editor/routing/modules/page/interface/component'
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { IWidgetElementHtml } from '@ws-widget/collection/src/public-api'

@Component({
  selector: 'ws-auth-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.scss'],
})

export class HtmlComponent extends WidgetEditorBaseComponent<IWidgetElementHtml> implements OnInit {

  @Input() identifier!: string
  @Input() widgetData!: IWidgetElementHtml
  @Output() data = new EventEmitter<IWidgetElementHtml>()
  location = CONTENT_BASE_WEBHOST_ASSETS
  dataType!: 'html' | 'template' | 'templateUrl'
  constructor() {
    super()
  }

  convertToFromJson(data: any, mode = 'toJson') {
    if (mode === 'toJson') {
      return data ? JSON.stringify(data) : ''
    }
    return data ? JSON.parse(data) : {}
  }

  update(key: string, value: any) {
    this.data.emit({
      ...this.widgetData,
      [key]: value,
    })
  }

  ngOnInit() {
    if (this.widgetData.html) {
      this.dataType = 'html'
    } else if (this.widgetData.template) {
      this.dataType = 'template'
    } else if (this.widgetData.templateUrl) {
      this.dataType = 'templateUrl'
    } else {
      this.dataType = 'html'
    }
  }

}
