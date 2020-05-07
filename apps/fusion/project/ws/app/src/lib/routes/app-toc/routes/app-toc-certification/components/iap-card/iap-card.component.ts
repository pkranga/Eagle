/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsContent } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-toc-certification-iap-card',
  templateUrl: './iap-card.component.html',
  styleUrls: ['./iap-card.component.scss'],
})
export class IapCardComponent implements OnInit {
  @Input() content?: NsContent.IContent

  constructor() {}

  ngOnInit() {}
}
