/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AuthNavBarToggleService } from '@ws/author/src/lib/services/auth-nav-bar-toggle.service'
import { MatSnackBar } from '@angular/material'
import { LoaderService } from './../../../../../../../../services/loader.service'
import { EditorService } from './../../../../../services/editor.service'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { ActivatedRoute, Router } from '@angular/router'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { NSApiRequest } from '../../../../../../../../interface/apiRequest'
import { mergeMap } from 'rxjs/operators'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'

@Component({
  selector: 'ws-auth-knowledge-artifact-pa',
  templateUrl: './knowledge-artifact-pa.component.html',
  styleUrls: ['./knowledge-artifact-pa.component.scss'],
})
export class KnowledgeArtifactPaComponent implements OnInit, OnDestroy {

  currentContent = ''
  content: NSContent.IContentMeta = {
    contentType: 'Knowledge Artifact',
  } as any
  mode: 'upload' | 'editor' = 'upload'
  constructor(
    private activateRouter: ActivatedRoute,
    private editorService: EditorService,
    private loaderService: LoaderService,
    private snackBar: MatSnackBar,
    private router: Router,
    private authNavBarSvc: AuthNavBarToggleService,
  ) { }

  ngOnInit() {
    this.activateRouter.data.subscribe(
      data => {
        if (data && data.content) {
          this.currentContent = data.content
        }
      },
    )
    this.authNavBarSvc.toggle(false)
  }

  ngOnDestroy() {
    this.authNavBarSvc.toggle(true)
  }

  submit() {
    const requestBody: NSApiRequest.IContentUpdate = {
      hierarchy: {},
      nodesModified: {
        [this.currentContent]: {
          isNew: false,
          root: true,
          metadata: this.content,
        },
      },
    }
    const body: NSApiRequest.IForwadBackwardActionGeneral = {
      comment: 'Author published Knowledge Artifact',
      operation: 1,
    }
    this.loaderService.changeLoad.next(true)
    this.editorService.updateContent(requestBody).pipe(
      mergeMap(() => this.editorService.forwardBackward(body, this.currentContent)),
    ).subscribe(
      () => {
        this.loaderService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.PUBLISH_SUCCESS_LATE,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        this.router.navigateByUrl('/page/resource-hub')
      },
      () => {
        this.loaderService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.PUBLISH_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
      },
    )
  }

  takeAction(data: any) {
    if (data === 'next') {
      this.submit()
    } else if (data === 'back') {
      if (this.mode !== 'upload') {
        this.mode = 'upload'
      } else {
        this.router.navigateByUrl('/page/resource-hub')
      }
    } else {
      this.content = data
      this.mode = 'editor'
    }
  }

}
