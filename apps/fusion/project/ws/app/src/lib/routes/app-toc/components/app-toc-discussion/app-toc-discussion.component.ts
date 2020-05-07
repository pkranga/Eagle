/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { NsDiscussionForum } from '@ws-widget/collection'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ActivatedRoute } from '../../../../../../../../../node_modules/@angular/router'

@Component({
  selector: 'ws-app-toc-discussion',
  templateUrl: './app-toc-discussion.component.html',
  styleUrls: ['./app-toc-discussion.component.scss'],
})
export class AppTocDiscussionComponent implements OnInit, OnChanges {
  @Input() content!: { description: string, identifier: string, name: string, title: string }
  discussionForumWidget: NsWidgetResolver.IRenderConfigWithTypedData<
    NsDiscussionForum.IDiscussionForumInput
    > | null = null
  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnChanges() {
    if (this.content) {
      this.discussionForumWidget = {
        widgetData: {
          description: this.content.description,
          id: this.content.identifier,
          name: NsDiscussionForum.EDiscussionType.LEARNING,
          title: this.content.name,
          initialPostCount: 2,
        },
        widgetSubType: 'discussionForum',
        widgetType: 'discussionForum',
      }
    }
  }

  ngOnInit() {
    if (this.activatedRoute.parent && this.activatedRoute.parent.data) {
      this.activatedRoute.parent.data.subscribe(
        (data: any) => {
          if (data && data.content && data.content.data) {
            this.content = data.content.data
            this.ngOnChanges()
          }
        },
      )
    }
  }
}
