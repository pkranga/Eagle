/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { NsContentStripMultiple } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-launchpad',
  templateUrl: './launchpad.component.html',
  styleUrls: ['./launchpad.component.scss'],
})
export class LaunchpadComponent implements OnInit {
  coursesFetched = false
  coursesResolverData: NsWidgetResolver.IRenderConfigWithTypedData<
    NsContentStripMultiple.IContentStripMultiple
  > = {
    widgetType: 'contentStrip',
    widgetSubType: 'contentStripMultiple',
    widgetData: {
      strips: [
        {
          key: '',
          preWidgets: [],
          title: '',
          filters: [],
          request: {
            ids: ['lex_auth_012612333141950464848'],
          },
        },
      ],
      loader: true,
    },
  }

  constructor() {
    this.coursesFetched = false
  }

  ngOnInit() { }
}
