/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { CONTENT_BASE_STATIC, CONTENT_BASE_STREAM } from '@ws/author/src/lib/constants/apiEndpoints'
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { MatSnackBar, MatDialog } from '@angular/material'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { VIDEO_MAX_SIZE } from '@ws/author/src/lib/constants/upload'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { UploadService } from '@ws/author/src/lib/routing/modules/editor/shared/services/upload.service'
import { tap, mergeMap, map } from 'rxjs/operators'
import { of } from 'rxjs'
import { HttpEventType } from '@angular/common/http'

@Component({
  selector: 'ws-auth-upload-kartifact',
  templateUrl: './upload-kartifact.component.html',
  styleUrls: ['./upload-kartifact.component.scss'],
})
export class UploadKartifactComponent implements OnInit {

  @Output() data = new EventEmitter<NSContent.IContentMeta | string>()
  @Input() currentContent = ''
  file!: File
  isChecked = false
  mimeType = ''
  duration = 0
  maxSize = VIDEO_MAX_SIZE / (1024 * 1024)
  content: NSContent.IContentMeta = {} as any
  enableUpload = true
  percentage = 0

  constructor(
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private matDialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  onDrop(file: File) {
    const fileName = file.name.replace(/[^A-Za-z0-9.]/g, '')
    if (
      !fileName.toLowerCase().endsWith('.pdf')
      &&
      !fileName.toLowerCase().endsWith('.mp4') &&
      !fileName.toLowerCase().endsWith('.mp3')
    ) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.INVALID_FORMAT,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
      // } else if (
      //   fileName.toLowerCase().endsWith('.mp3')
      // ) {
      //   this.snackBar.openFromComponent(NotificationComponent, {
      //     data: {
      //       type: Notify.NOT_READY,
      //     },
      //     duration: NOTIFICATION_TIME * 1000,
      //   })
    } else if (file.size > VIDEO_MAX_SIZE) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.SIZE_ERROR,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    } else {
      this.file = file
      this.mimeType = fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' :
        fileName.toLowerCase().endsWith('.mp4') ? 'application/x-mpegURL' : 'audio/mpeg'
      if (this.mimeType === 'application/x-mpegURL' || this.mimeType === 'audio/mpeg') {
        this.getDuration()
      } else {
        this.duration = 3600
        this.upload()
      }
    }
  }

  upload() {
    const formdata = new FormData()
    formdata.append('content', (this.file as Blob), (this.file as File).name.replace(/[^A-Za-z0-9.]/g, ''))
    this.enableUpload = false
    this.uploadService.upload(
      formdata,
      {
        contentId: this.currentContent,
        contentType: this.mimeType === 'application/pdf' ? CONTENT_BASE_STATIC : CONTENT_BASE_STREAM,
      },
      {
        reportProgress: true,
        observe: 'events',
      },
    ).pipe(
      map((event: any) => {

        switch (event.type) {

          case HttpEventType.UploadProgress:
            this.percentage = Math.round(100 * event.loaded / event.total)
            return { status: 'progress', message: this.percentage }

          case HttpEventType.Response:
            return event.body
          default:
            return `Unhandled event: ${event.type}`
        }
      }),
      tap(v => {
        if (v.code) {
          const url = (v.authArtifactURL || v.artifactURL).replace(/%2F/g, '/')
          this.content.artifactUrl = url
          this.content.downloadUrl = this.mimeType !== 'application/x-mpegURL' ? url : ''
          this.content.mimeType = this.mimeType
          this.content.duration = this.duration
          this.content.size = this.file.size
        }
      }),
      mergeMap(v => {
        if (this.mimeType === 'application/x-mpegURL' && v.code) {
          return this.uploadService.startEncoding(v.authArtifactURL || v.artifactURL, this.currentContent).pipe(
            map(() => v),
          )
        }
        return of(v)
      }),
    ).subscribe(
      v => {
        if (v.code) {
          this.enableUpload = true
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.UPLOAD_SUCCESS,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        }
      },
      () => {
        this.enableUpload = true
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.UPLOAD_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
      },
    )
  }

  storeData() {
    if (!this.content.artifactUrl) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.UPLOAD_FILE,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    } else if (!this.isChecked) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.IPR_DECLARATION_PF,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    } else {
      this.data.emit(this.content)
    }
  }

  getDuration() {
    const content = document.createElement(this.mimeType === 'application/x-mpegURL' ? 'video' : 'audio')
    content.preload = 'metadata'
    this.enableUpload = false
    content.onloadedmetadata = () => {
      window.URL.revokeObjectURL(content.src)
      this.duration = Math.round(content.duration)
      this.enableUpload = true
      this.upload()
    }
    content.onerror = () => {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.UPLOAD_FAIL,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    }
    content.src = URL.createObjectURL(this.file)
  }

  back() {
    this.data.emit('back')
  }

  showIpr(template: any) {
    this.matDialog.open(template, {
      width: 'auto',
    })
  }

  closeIpr() {
    this.matDialog.closeAll()
  }
}
