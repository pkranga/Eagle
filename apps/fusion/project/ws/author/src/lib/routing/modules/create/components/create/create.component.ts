/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Router, ActivatedRoute } from '@angular/router'
import { CreateService } from './create.service'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { IEntity } from '../../interface/entity'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-auth-generic',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit, OnDestroy {

  entity: IEntity[] = [
    {
      name: 'Resource',
      description: 'Create the smallest learning entity',
      icon: 'insert_drive_file',
      contentType: 'Resource',
      mimeType: 'application/html',
      hasRole: ['content-creator', 'editor', 'admin'],
      options: [
        {
          name: 'Attach a Link',
          icon: 'link',
          contentType: 'Resource',
          mimeType: 'application/html',
          hasRole: ['content-creator', 'editor', 'admin'],
        },
        {
          name: 'Upload Content',
          icon: 'cloud_upload',
          contentType: 'Resource',
          mimeType: 'application/pdf',
          hasRole: ['content-creator', 'editor', 'admin'],
        },
        {
          name: 'Activities',
          icon: 'videogame_asset',
          contentType: 'Resource',
          mimeType: 'application/html',
          hasRole: ['content-creator', 'editor', 'admin'],

        },
        {
          name: 'Assessment',
          icon: 'check_circle',
          contentType: 'Resource',
          mimeType: 'application/quiz',
          hasRole: ['content-creator', 'editor', 'admin'],

        },
        {
          name: 'Web Page',
          icon: 'insert_drive_file',
          contentType: 'Resource',
          mimeType: 'application/web-module',
          hasRole: ['content-creator', 'editor', 'admin'],

        },
      ],
    },
    {
      name: 'Channel Page',
      description: 'Create a Channel Page',
      icon: 'chrome_reader_mode',
      contentType: 'Channel',
      mimeType: 'application/channel',
      hasRole: ['channel-creator', 'editor', 'admin'],
    },
    {
      name: 'Knowledge Board',
      description: 'Create a Knowledge Board',
      icon: 'folder',
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'Knowledge Board',
      hasRole: ['kb-curator', 'kb-creator', 'editor', 'admin'],
    },
    {
      name: 'Knowledge Artifact',
      description: 'Create a Knowledge Artifact',
      icon: 'folder',
      mimeType: 'application/vnd.ekstep.content-collection',
      contentType: 'Knowledge Artifact',
      hasRole: ['ka-creator', 'editor', 'admin'],
    },
    {
      name: 'Module',
      description: 'Create a collection of Resources',
      icon: 'folder',
      contentType: 'Resource',
      mimeType: 'application/html',
      hasRole: ['content-creator', 'editor', 'admin'],
    },
    {
      name: 'Course',
      description: 'Create a collection of Modules',
      icon: 'folder_open',
      contentType: 'Resource',
      mimeType: 'application/html',
      hasRole: ['content-creator', 'editor', 'admin'],
    },
    {
      name: 'Program',
      description: 'Create a collection of Courses',
      icon: 'folder_special',
      contentType: 'Resource',
      mimeType: 'application/html',
      hasRole: ['content-creator', 'editor', 'admin'],
    },
  ]
  routerSubscription = <Subscription>{}
  allLanguages: any
  language = ''

  constructor(
    private snackBar: MatSnackBar,
    private svc: CreateService,
    private router: Router,
    private loaderService: LoaderService,
    private activatedRoute: ActivatedRoute,
    private accessControlSvc: AccessControlService,
  ) { }

  ngOnInit() {
    this.loaderService.changeLoadState(false)
    this.routerSubscription = this.activatedRoute.data.subscribe(data => {
      this.allLanguages = data.ordinals.subTitles || []
    })
    this.language = this.accessControlSvc.locale
  }

  ngOnDestroy() { }

  contentClicked(content: IEntity) {
    this.loaderService.changeLoad.next(true)
    this.svc.create({ contentType: content.contentType, mimeType: content.mimeType, locale: this.language }).subscribe(
      (id: string) => {
        this.loaderService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.CONTENT_CREATE_SUCCESS,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        this.router.navigateByUrl(`/author/editor/${id}`)
      },
      () => {
        this.loaderService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.CONTENT_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
      },
    )
  }

  setCurrentLanguage(lang: string) {
    this.language = lang
  }

}
