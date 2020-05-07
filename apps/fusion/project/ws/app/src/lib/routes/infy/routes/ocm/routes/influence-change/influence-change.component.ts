/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
// import { IWsInfluencerConfig } from '../../../../models/ocm.model'
// import { IWsDiscussionForumInput } from '../../../../models/social.model'

@Component({
  selector: 'ws-app-influence-change',
  templateUrl: './influence-change.component.html',
  styleUrls: ['./influence-change.component.scss'],
})
export class InfluenceChangeComponent implements OnInit {
  constructor() {}

  async ngOnInit() {
    // const instanceConfig = await this.configSvc.getInstanceConfig()
    // if (this.config) {
    //   this.discussionForumInput = {
    //     id: 'explore-wow',
    //     initialPostCount: 2,
    //     name: instanceConfig.platformConfig.appName,
    //   }
    // }
  }
}
