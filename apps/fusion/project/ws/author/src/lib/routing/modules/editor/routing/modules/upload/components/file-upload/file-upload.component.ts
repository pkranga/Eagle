/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AuthInitService } from './../../../../../../../../services/init.service'
import { IFormMeta } from './../../../../../../../../interface/form'
import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { CONTENT_BASE_STATIC, CONTENT_BASE_STREAM } from '@ws/author/src/lib/constants/apiEndpoints'
import { IprDialogComponent } from '@ws/author/src/lib/modules/shared/components/ipr-dialog/ipr-dialog.component'
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core'
import { FormGroup, FormBuilder } from '@angular/forms'
import { MatSnackBar } from '@angular/material'
import { MatDialog } from '@angular/material/dialog'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { VIDEO_MAX_SIZE } from '@ws/author/src/lib/constants/upload'
import { EditorContentService } from '@ws/author/src/lib/routing/modules/editor/services/editor-content.service'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { UploadService } from '@ws/author/src/lib/routing/modules/editor/shared/services/upload.service'
import { tap, mergeMap, map } from 'rxjs/operators'
import { of } from 'rxjs'

@Component({
  selector: 'ws-auth-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  fileUploadForm!: FormGroup
  iprAccepted = false
  file!: File | null
  mimeType = ''
  currentContent = ''
  enableUpload = true
  duration = 0
  canUpdate = true
  @Input() isSubmitPressed = false
  @Input() canTransCode = false
  @Output() data = new EventEmitter<any>()

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private contentService: EditorContentService,
    private uploadService: UploadService,
    private loaderService: LoaderService,
    private authInitService: AuthInitService,
  ) { }

  ngOnInit() {
    this.contentService.changeActiveCont.subscribe(
      data => {
        this.currentContent = data
        this.assignData(this.contentService.getUpdatedMeta(data))
      },
    )
  }

  assignData(meta: NSContent.IContentMeta) {
    if (!this.fileUploadForm) {
      this.createForm()
    }
    this.canUpdate = false
    this.fileUploadForm.controls.artifactUrl.setValue(meta.artifactUrl || '')
    this.fileUploadForm.controls.mimeType.setValue(meta.mimeType || 'application/pdf')
    this.fileUploadForm.controls.isIframeSupported.setValue(meta.isIframeSupported || 'Yes')
    this.fileUploadForm.controls.isInIntranet.setValue(meta.isInIntranet || false)
    this.fileUploadForm.controls.isExternal.setValue(meta.isExternal || false)
    this.fileUploadForm.controls.size.setValue(meta.size || 0)
    this.fileUploadForm.controls.duration.setValue(meta.duration || 0)
    this.canUpdate = true
    this.fileUploadForm.markAsPristine()
    this.fileUploadForm.markAsUntouched()
    if (meta.artifactUrl) {
      this.iprAccepted = true
    }
  }

  createForm() {
    this.fileUploadForm = this.formBuilder.group({
      artifactUrl: [],
      isExternal: [],
      isIframeSupported: [],
      isInIntranet: [],
      mimeType: [],
      size: [],
      duration: [],
      downloadUrl: [],
    })
    this.fileUploadForm.valueChanges.subscribe(
      () => {
        if (this.canUpdate) {
          this.storeData()
        }
      },
    )
    this.fileUploadForm.controls.artifactUrl.valueChanges.subscribe(
      () => {
        this.iprAccepted = false
      },
    )
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
    } else if (
      !this.canTransCode &&
      fileName.toLowerCase().endsWith('.mp3')
    ) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.NOT_READY,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
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
      }
    }
  }

  showIpr() {
    const dialogRef = this.dialog.open(IprDialogComponent, {
      width: '70%',
      data: { iprAccept: this.iprAccepted },
    })
    dialogRef.afterClosed().subscribe(result => {
      this.iprAccepted = result
    })
  }

  iprChecked() {
    this.iprAccepted = !this.iprAccepted
  }

  clearUploadedFile() {
    this.fileUploadForm.controls.artifactUrl.setValue(null)
    this.file = null
    this.duration = 0
    this.mimeType = ''
  }

  triggerUpload() {

    if (!this.file) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.UPLOAD_FILE,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    } else if (!this.iprAccepted) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.IPR_DECLARATION,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    } else {
      this.upload()
    }
  }

  upload() {
    const formdata = new FormData()
    formdata.append('content', (this.file as Blob), (this.file as File).name.replace(/[^A-Za-z0-9.]/g, ''))
    this.loaderService.changeLoad.next(true)
    this.uploadService.upload(
      formdata,
      {
        contentId: this.currentContent,
        contentType: this.mimeType === 'application/pdf' ? CONTENT_BASE_STATIC : CONTENT_BASE_STREAM,
      },
    ).pipe(
      tap(v => {
        if (v.code) {
          this.canUpdate = false
          const url = (v.authArtifactURL || v.artifactURL).replace(/%2F/g, '/')
          this.fileUploadForm.controls.artifactUrl.setValue(url)
          this.fileUploadForm.controls.downloadUrl.setValue(this.mimeType !== 'application/x-mpegURL' ? url : '')
          this.fileUploadForm.controls.mimeType.setValue(this.mimeType)
          this.fileUploadForm.controls.duration.setValue(this.duration)
          this.fileUploadForm.controls.size.setValue((this.file as File).size)
          this.canUpdate = true
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
          this.loaderService.changeLoad.next(false)
          this.storeData()
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.UPLOAD_SUCCESS,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
          this.data.emit('next')
        }
      },
      () => {
        this.loaderService.changeLoad.next(false)
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
    const originalMeta = this.contentService.getOriginalMeta(this.currentContent)
    const currentMeta = this.fileUploadForm.value
    const meta: any = {}
    Object.keys(currentMeta).map(v => {
      if (
        JSON.stringify(currentMeta[v as keyof NSContent.IContentMeta]) !==
        JSON.stringify(originalMeta[v as keyof NSContent.IContentMeta])
      ) {
        if (currentMeta[v] ||
          (
            this.authInitService.authConfig[v as keyof IFormMeta].type === 'boolean' &&
            currentMeta[v] === false
          )
        ) {
          meta[v] = currentMeta[v]
        } else {
          meta[v] =
            JSON.parse(JSON.stringify(
              this.authInitService.authConfig[v as keyof IFormMeta].defaultValue[originalMeta.contentType][0].value,
            ))
        }
      }
    })
    this.contentService.setUpdatedMeta(meta, this.currentContent)
  }

  getDuration() {
    const content = document.createElement(this.mimeType === 'application/x-mpegURL' ? 'video' : 'audio')
    content.preload = 'metadata'
    this.enableUpload = false
    content.onloadedmetadata = () => {
      window.URL.revokeObjectURL(content.src)
      this.duration = Math.round(content.duration)
      this.enableUpload = true
    }
    content.src = URL.createObjectURL(this.file)
  }

}
