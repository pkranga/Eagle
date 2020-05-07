/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { MatDialog } from '@angular/material/dialog'
import { UploadService } from './../../../../../shared/services/upload.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { ActivatedRoute } from '@angular/router'
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { NSContent } from '../../../../../../../../interface/content'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { IMAGE_SUPPORT_TYPES, IMAGE_MAX_SIZE } from '../../../../../../../../constants/upload'
import { ImageCropComponent } from '../../../../../../../../../../../../../library/ws-widget/utils/src/public-api'
import { CONTENT_BASE_STATIC } from '../../../../../../../../constants/apiEndpoints'
import { map } from 'rxjs/operators'
import { HttpEventType } from '@angular/common/http'

@Component({
  selector: 'ws-auth-editor-kartifact',
  templateUrl: './editor-kartifact.component.html',
  styleUrls: ['./editor-kartifact.component.scss'],
})
export class EditorKartifactComponent implements OnInit {

  @Input() content!: NSContent.IContentMeta
  @Input() currentContent!: string
  @Output() data = new EventEmitter<string>()
  canSubmit = true
  ordinals: any
  percentage = 0
  isSubmitted = false
  imageSupportedTypes = IMAGE_SUPPORT_TYPES
  maxSize = IMAGE_MAX_SIZE / (1024 * 1024)
  file!: File | null
  complexityLevelList: string[] = []

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      data => {
        this.ordinals = data.ordinals
        this.complexityLevelList = data.ordinals.complexityLevel
        this.filterOrdinals()
      },
    )
  }

  filterOrdinals() {
    this.complexityLevelList = []
    this.ordinals.complexityLevel.map(
      (v: any) => {
        if (v.condition) {
          let canAdd = false;
          (v.condition.showFor || []).map(
            (con: any) => {
              let innerCondition = false
              Object.keys(con).map(
                meta => {
                  if (con[meta].indexOf(this.content[meta as keyof NSContent.IContentMeta]) > -1) {
                    innerCondition = true
                  }
                },
              )
              if (innerCondition) {
                canAdd = true
              }
            },
          )
          if (canAdd) {
            (v.condition.nowShowFor || []).map(
              (con: any) => {
                let innerCondition = false
                Object.keys(con).map(
                  meta => {
                    if (con[meta].indexOf(this.content[meta as keyof NSContent.IContentMeta]) < 0) {
                      innerCondition = true
                    }
                  },
                )
                if (innerCondition) {
                  canAdd = false
                }
              },
            )
          }
          if (canAdd) {
            this.complexityLevelList.push(v.value)
          }
        } else {
          if (typeof v === 'string') {
            this.complexityLevelList.push(v)
          } else {
            this.complexityLevelList.push(v.value)
          }
        }
      })
  }

  submit() {
    this.isSubmitted = true
    if (
      !this.content.name ||
      !this.content.description ||
      !this.content.categoryType ||
      !this.content.complexityLevel ||
      !this.content.appIcon
    ) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.MANDATORY_FIELD_ERROR,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    } else {
      this.data.emit('next')
    }
  }

  back() {
    this.data.emit('back')
  }

  uploadAppIcon(file: File) {
    this.file = file
    const formdata = new FormData()
    const fileName = file.name.replace(/[^A-Za-z0-9.]/g, '')
    if (
      !(
        IMAGE_SUPPORT_TYPES.indexOf(
          `.${fileName
            .toLowerCase()
            .split('.')
            .pop()}`,
        ) > -1
      )
    ) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.INVALID_FORMAT,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
      return
    }

    if (file.size > IMAGE_MAX_SIZE) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.SIZE_ERROR,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
      return
    }

    const dialogRef = this.dialog.open(ImageCropComponent, {
      width: '70%',
      data: {
        isRoundCrop: false,
        imageFile: file,
      },
    })

    dialogRef.afterClosed().subscribe({
      next: (result: File) => {
        if (result) {
          this.canSubmit = false
          formdata.append('content', result, fileName)
          this.uploadService
            .upload(
              formdata,
              { contentId: this.currentContent, contentType: CONTENT_BASE_STATIC },
              // tslint:disable-next-line: ter-indent
              {
                // tslint:disable-next-line: ter-indent
                reportProgress: true,
                // tslint:disable-next-line: ter-indent
                observe: 'events',
                // tslint:disable-next-line: ter-indent
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
            )
            .subscribe(
              data => {
                if (data.code) {
                  this.canSubmit = true
                  this.content.appIcon = data.artifactURL
                  this.content.thumbnail = data.artifactURL
                  this.content.posterImage = data.artifactURL
                  this.snackBar.openFromComponent(NotificationComponent, {
                    data: {
                      type: Notify.UPLOAD_SUCCESS,
                    },
                    duration: NOTIFICATION_TIME * 1000,
                  })
                }
              },
              () => {
                this.canSubmit = true
                this.snackBar.openFromComponent(NotificationComponent, {
                  data: {
                    type: Notify.UPLOAD_FAIL,
                  },
                  duration: NOTIFICATION_TIME * 1000,
                })
              },
            )
        } else {
          this.file = null
        }
      },
    })
  }

}
