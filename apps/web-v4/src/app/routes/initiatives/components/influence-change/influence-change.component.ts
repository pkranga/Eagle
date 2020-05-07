/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IInfluencerConfig } from '../../../../models/wingspan-pages.model';
import { ConfigService } from '../../../../services/config.service';
import { IDiscussionForumInput } from '../../../../models/social.model';
import { TocService } from '../../../toc/services/toc.service';
import { UserService } from '../../../../services/user.service';

interface WindowYammerModified extends Window {
  yam?: any;
}
declare var window: WindowYammerModified;

@Component({
  selector: 'app-influence-change',
  templateUrl: './influence-change.component.html',
  styleUrls: ['./influence-change.component.scss']
})
export class InfluenceChangeComponent implements OnInit {
  @Input() config: IInfluencerConfig;
  discussionForumInput: IDiscussionForumInput;

  constructor(private configSvc: ConfigService, private tocSvc: TocService, private userSvc: UserService) {}

  ngOnInit() {
    if (this.config) {
      if (!this.configSvc.instanceConfig.features.siemens.enabled) {
        this.tocSvc.scriptSetup().subscribe(() => {
          this.loadYammer();
        });
      } else {
        this.discussionForumInput = {
          contentId: 'explore-wow',
          initialPostCount: 2,
          sourceName: this.configSvc.instanceConfig.platform.appName
        };
      }
    }
  }

  loadYammer() {
    const yammerData = {
      feedType: 'open-graph',
      config: {
        use_sso: false,
        header: true,
        footer: true,
        showOpenGraphPreview: false,
        defaultToCanonical: false,
        hideNetworkName: true,
        defaultGroupId: this.config.yammerGroupId,
        promptText: 'Ask a question...'
      },
      objectProperties: {
        url: document.baseURI + location.pathname,
        type: 'page',
        fetch: false,
        private: false,
        ignore_canonical_url: false
      },
      container: '#yammer-feed'
    };
    window.yam.connect.embedFeed(yammerData);
  }
}
