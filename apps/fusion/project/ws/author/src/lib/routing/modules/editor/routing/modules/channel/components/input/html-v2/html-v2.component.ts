/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IWidgetElementHtml } from '@ws-widget/collection'
import { CONTENT_BASE_WEBHOST_ASSETS } from '@ws/author/src/lib/constants/apiEndpoints'
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'ws-auth-html-v2',
  templateUrl: './html-v2.component.html',
  styleUrls: ['./html-v2.component.scss'],
})
export class HtmlV2Component implements OnInit {
  showInfo = ''
  @Input() isSubmitPressed = false
  @Input() content!: IWidgetElementHtml
  @Input() identifier = ''
  location = CONTENT_BASE_WEBHOST_ASSETS
  @Output() data = new EventEmitter<{ content: IWidgetElementHtml; isValid: boolean }>()
  dataType: 'html' | 'editor' = 'html'

  constructor() { }

  update(value: any, dataType: any) {
    if (dataType === 'editor') {
      this.content.html = value
    } else if (dataType === 'html') {
      this.content.html = value.target.value
    }
  }

  ngOnInit() { }
}
