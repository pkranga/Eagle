/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NSContent } from '@ws/author/src/lib/interface/content'
import { EditorContentService } from '@ws/author/src/lib/routing/modules/editor/services/editor-content.service'
import { Subscription } from 'rxjs'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router, NavigationStart } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { filter } from 'rxjs/operators'

@Component({
  selector: 'ws-auth-root-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [EditorContentService],
})
export class EditorComponent implements OnInit, OnDestroy {

  routerSubscription!: Subscription
  routerEventSubscription!: Subscription
  constructor(
    private router: ActivatedRoute,
    private route: Router,
    private contentService: EditorContentService,
    private snackBar: MatSnackBar,
  ) {
    this.routerEventSubscription = this.route.events
      .pipe(
        filter((event: any) => {
          return (event instanceof NavigationStart)
        },
        ),
      ).subscribe(
        (event: NavigationStart) => {
          if (event.navigationTrigger === 'popstate') {
            if (event.url.indexOf('author/editor') > -1) {
              window.history.go(-1)
            }
          }
        },
      )
  }

  ngOnDestroy() {
    this.contentService.reset()
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe()
    }
    if (this.routerEventSubscription) {
      this.routerEventSubscription.unsubscribe()
    }
  }

  ngOnInit() {
    let hasAccess = false
    this.routerSubscription = this.router.data.subscribe(data => {
      if (data.contents) {
        const contents: { content: NSContent.IContentMeta, data: any }[] = data.contents
        if (contents[0].content.status === 'Deleted') {
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.DELETED,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
          this.route.navigateByUrl('/author/home')
        }
        if (this.contentService.hasAccess(contents[0].content)) {
          hasAccess = true
          this.contentService.setOriginalMeta(contents[0].content)
          contents.map(v => {
            if (
              this.contentService.hasAccess(v.content) &&
              !v.content.isContentEditingDisabled &&
              !v.content.isMetaEditingDisabled &&
              v.content.status !== 'Deleted'
            ) {
              this.contentService.setOriginalMeta(v.content)
            }
          })
          this.contentService.changeActiveCont.next(contents[0].content.identifier)
          this.contentService.currentContent = contents[0].content.identifier
          this.contentService.parentContent = contents[0].content.identifier
        }
        if (
          !hasAccess ||
          contents[0].content.isContentEditingDisabled ||
          contents[0].content.isMetaEditingDisabled
        ) {
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.NO_ACCESS,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
          this.route.navigateByUrl('/author/home')
        }
        if (hasAccess && contents[0].content) {
          if (contents[0].content.mimeType === 'application/html' ||
            contents[0].content.mimeType === 'video/x-youtube') {
            this.route.navigate(['curate'], { relativeTo: this.router })
          } else if (contents[0].content.contentType === 'Channel') {
            this.route.navigate(['channel'], { relativeTo: this.router })
          } else if (contents[0].content.contentType === 'Knowledge Board') {
            this.route.navigate(['knowledge-board'], { relativeTo: this.router })
          } else if (['application/pdf', 'application/x-mpegURL', 'audio/mp3'].indexOf(contents[0].content.mimeType) > -1) {
            this.route.navigate(['upload'], { relativeTo: this.router })
          } else if (contents[0].content.contentType === 'Knowledge Artifact') {
            this.route.navigate(['upload'], { relativeTo: this.router })
          } else {
            this.route.navigate(['curate'], { relativeTo: this.router })
          }
        }
      }
    })
  }
}
