/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { NsDiscussionForum } from '../../ws-discussion-forum.model'
import { EditorQuillComponent } from '../../editor-quill/editor-quill.component'
import { TFetchStatus, ConfigurationsService } from '@ws-widget/utils'
import { MatSnackBar } from '@angular/material'
import { WsDiscussionForumService } from '../../ws-discussion-forum.services'

@Component({
  selector: 'ws-widget-discussion-forum',
  templateUrl: './discussion-forum.component.html',
  styleUrls: ['./discussion-forum.component.scss'],
})
export class DiscussionForumComponent extends WidgetBaseComponent
  implements OnInit, NsWidgetResolver.IWidgetData<NsDiscussionForum.IDiscussionForumInput> {
  @Input() widgetData!: NsDiscussionForum.IDiscussionForumInput

  @ViewChild('editorQuill', { static: true }) editorQuill: EditorQuillComponent | null = null
  @ViewChild('postEnabled', { static: true }) postEnabled: ElementRef<HTMLInputElement> | null = null
  @ViewChild('postDisabled', { static: true }) postDisabled: ElementRef<HTMLInputElement> | null = null

  discussionFetchStatus: TFetchStatus = 'none'
  discussionRequest: NsDiscussionForum.ITimelineRequest = {
    pgNo: 0,
    pgSize: 4,
    postKind: [],
    sessionId: Date.now(),
    type: NsDiscussionForum.ETimelineType.DISCUSSION_FORUM,
    userId: '',
    source: undefined,
  }
  isPostingDiscussion = false
  discussionResult: NsDiscussionForum.ITimeline = {
    hits: 0,
    result: [],
  }

  isValidPost = false
  editorText: undefined | string
  userEmail = ''
  userId = ''
  userName = ''
  constructor(
    private snackBar: MatSnackBar,
    private discussionSvc: WsDiscussionForumService,
    private configSvc: ConfigurationsService,
  ) {
    super()
    if (this.configSvc.userProfile) {
      this.userId = this.configSvc.userProfile.userId || ''
      this.userEmail = this.configSvc.userProfile.email || ''
      this.userName = this.configSvc.userProfile.userName || ''
    }
    this.discussionRequest.userId = this.userId
  }

  ngOnInit() {
    if (this.widgetData.initialPostCount) {
      this.discussionRequest.pgSize = this.widgetData.initialPostCount
    }
    this.discussionRequest.source = {
      id: this.widgetData.id,
      name: this.widgetData.name,
    }
    this.fetchDiscussion()
  }

  fetchDiscussion(refresh = false) {
    this.discussionFetchStatus = 'fetching'
    if (refresh) {
      this.discussionRequest.sessionId = Date.now()
      this.discussionRequest.pgNo = 0
    }
    this.discussionSvc.fetchTimelineData(this.discussionRequest).subscribe(
      data => {
        if (data.hits && data.result) {
          if (refresh) {
            this.discussionResult = {
              hits: 0,
              result: [],
            }
          }
          this.discussionResult.hits = data.hits
          this.discussionResult.result = [...this.discussionResult.result, ...data.result]
          if (data.hits > this.discussionResult.result.length) {
            this.discussionFetchStatus = 'hasMore';
            (this.discussionRequest.pgNo as number) += 1
          } else {
            this.discussionFetchStatus = 'done'
          }
        } else if (!this.discussionResult.result.length) {
          this.discussionFetchStatus = 'none'
        }
      },
      _err => {
        this.discussionFetchStatus = 'error'
      },
    )
  }

  publishConversation(failMsg: string) {
    this.isPostingDiscussion = true
    const postPublishRequest: NsDiscussionForum.IPostPublishRequest = {
      postContent: {
        abstract: '',
        body: '',
        title: this.editorText || '',
      },
      postCreator: this.userId,
      postKind: NsDiscussionForum.EPostKind.BLOG,
      source: {
        id: this.widgetData.id,
        name: this.widgetData.name,
      },
    }
    this.discussionSvc.publishPost(postPublishRequest).subscribe(
      (_data: any) => {
        this.editorText = undefined
        this.isValidPost = false
        this.isPostingDiscussion = false
        if (this.editorQuill) {
          this.editorQuill.resetEditor()
        }
        this.fetchDiscussion(true)
      },
      () => {
        this.snackBar.open(failMsg)
        this.isPostingDiscussion = false
      },
    )
  }

  onDeletePost(replyIndex: number) {
    this.discussionResult.result.splice(replyIndex, 1)
    this.discussionResult.hits -= 1
    if (!this.discussionResult.result.length) {
      this.discussionFetchStatus = 'none'
    }
  }

  onTextChange(eventData: { isValid: boolean; htmlText: string }) {
    this.isValidPost = eventData.isValid
    this.editorText = eventData.htmlText
  }
}
