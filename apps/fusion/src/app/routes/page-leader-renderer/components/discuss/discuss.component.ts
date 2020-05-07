/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { TFetchStatus } from '@ws-widget/utils'
import { IWsDiscussionForumInput, IWsLeader } from '../../model/leadership.model'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { NsDiscussionForum } from '@ws-widget/collection'

@Component({
  selector: 'ws-discuss',
  templateUrl: './discuss.component.html',
  styleUrls: ['./discuss.component.scss'],
})
export class DiscussComponent implements OnInit {
  @Input() pageId = ''
  @Input() leaderProfile: IWsLeader | null = null

  isDiscussionsDoneByLeader = false
  discussionFetchStatus: TFetchStatus = 'none'
  discussionForumInput: IWsDiscussionForumInput | null = null
  userId = ''
  appName = ''

  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
  > | null = null

  constructor() { }

  ngOnInit() {
    if (this.leaderProfile) {
      this.discussionForumWidget = {
        widgetData: {
          id: this.pageId,
          title: '',
          name: NsDiscussionForum.EDiscussionType.LEARNING,
          initialPostCount: 2,
        },
        widgetSubType: 'discussionForum',
        widgetType: 'discussionForum',
      }
      this.discussionForumWidget = { ...this.discussionForumWidget }
      this.discussionFetchStatus = 'done'
    }
  }
}
