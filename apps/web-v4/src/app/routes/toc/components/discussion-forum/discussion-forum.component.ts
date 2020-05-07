/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { TocService } from '../../services/toc.service';
import { IContent } from '../../../../models/content.model';
import { IDiscussionForumInput } from '../../../../models/social.model';
import { ConfigService } from '../../../../services/config.service';

interface WindowYammerModified extends Window {
  yam?: any;
}
declare var window: WindowYammerModified;

@Component({
  selector: 'app-discussion-forum',
  templateUrl: './discussion-forum.component.html',
  styleUrls: ['./discussion-forum.component.scss']
})
export class DiscussionForumComponent implements OnInit {
  @Input() content: IContent;
  discussionForumInput: IDiscussionForumInput;
  constructor(private tocSvc: TocService, private configSvc: ConfigService) { }

  ngOnInit() {
    if (this.configSvc.instanceConfig.features.toc.subFeatures.discussionForum.config.yammer) {
      this.tocSvc.scriptSetup().subscribe(() => {
        this.loadYammer();
      });
    } else {
      this.discussionForumInput = {
        contentId: this.content.identifier,
        sourceName: this.configSvc.instanceConfig.platform.appName,
        description: this.content.description,
        title: this.content.name
      };
    }
  }

  loadYammer() {
    if (this.content) {
      const yammerData = {
        feedType: 'open-graph',
        config: {
          use_sso: false,
          header: true,
          footer: true,
          showOpenGraphPreview: false,
          defaultToCanonical: false,
          hideNetworkName: true,
          defaultGroupId: 14334668,
          promptText: 'Ask a question...'
        },
        objectProperties: {
          url: document.baseURI + location.pathname,
          type: 'page',
          fetch: false,
          private: false,
          ignore_canonical_url: false,
          title: this.content.name,
          description: this.content.description
        },
        container: '#yammer-feed'
      };
      window.yam.connect.embedFeed(yammerData);
    }
  }
}
