/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { EditorService } from '@ws/author/src/lib/routing/modules/editor/services/editor.service'
import { IWidgetsPlayerMediaData } from '@ws-widget/collection'
import { IMAGE_MAX_SIZE, VIDEO_MAX_SIZE } from '@ws/author/src/lib/constants/upload'
import { CONTENT_BASE_WEBHOST_ASSETS, AUTHORING_CONTENT_BASE } from '@ws/author/src/lib/constants/apiEndpoints'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { UploadService } from '@ws/author/src/lib/routing/modules/editor/shared/services/upload.service'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { MatSnackBar } from '@angular/material'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { WidgetEditorBaseComponent } from '@ws/author/src/lib/routing/modules/editor/routing/modules/page/interface/component'

interface ISubtitle {
  srclang: string,
  label: string,
}

@Component({
  selector: 'ws-auth-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
})

export class MediaComponent implements WidgetEditorBaseComponent<IWidgetsPlayerMediaData>, OnInit {

  @Input() identifier!: string
  @Input() widgetData!: IWidgetsPlayerMediaData
  @Output() data = new EventEmitter<IWidgetsPlayerMediaData>()
  selectedSubtitle!: ISubtitle
  subTitles!: ISubtitle
  constructor(
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private editorService: EditorService,
  ) { }

  ngOnInit() {
    this.subTitles = this.editorService.ordinals.subTitles.filter(
      (v: ISubtitle) => !(this.widgetData.subtitles || []).find(j => j.srclang === v.srclang),
    )
  }

  update(key: string, value: any) {
    this.data.emit({
      ...this.widgetData,
      [key]: value,
    })
  }

  removeSubtitle(index: number) {
    const subtitles = JSON.parse(JSON.stringify(this.widgetData.subtitles))
    subtitles.splice(index, 1)
    this.data.emit({
      ...this.widgetData,
      subtitles,
    })
  }

  upload(file: File, type: 'video' | 'image' | 'subtitle') {
    const formdata = new FormData()
    const fileName = file.name.replace(/[^A-Za-z0-9.]/g, '')
    if ((!(fileName.toLowerCase().endsWith('.mp4')) && type === 'video') ||
      (!(file.type.indexOf('image/') > -1) && type === 'image') ||
      ((!fileName.toLowerCase().endsWith('.vtt')) && type === 'subtitle')
    ) {
      this.selectedSubtitle = undefined as any
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.INVALID_FORMAT,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
      return
    }

    if ((file.type.indexOf('image/') > -1 && file.size > IMAGE_MAX_SIZE) ||
      (fileName.toLowerCase().endsWith('.mp4') && file.size > VIDEO_MAX_SIZE)) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.SIZE_ERROR,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
      return
    }

    formdata.append('content', file, fileName)

    this.uploadService.upload(formdata,
      // tslint:disable-next-line:align
      { contentId: this.identifier, contentType: CONTENT_BASE_WEBHOST_ASSETS }).subscribe(
        data => {
          if (data.code) {
            if (type === 'image') {
              this.data.emit({
                ...this.widgetData,
                posterImage: data.artifactURL
                  .replace(/^.*\/\/[^\/]+:?[0-9]?\//i, AUTHORING_CONTENT_BASE),
              })
            } else if (type === 'video') {
              this.data.emit({
                ...this.widgetData,
                url: (data.authArtifactURL || data.authArtifactUrl).replace(/%2F/g, '/')
                  .replace(/^.*\/\/[^\/]+:?[0-9]?\//i, AUTHORING_CONTENT_BASE),
              })
            } else {
              const subtitles = JSON.parse(JSON.stringify(this.widgetData.subtitles || []))
              subtitles.push({
                srclang: this.selectedSubtitle.srclang,
                label: this.selectedSubtitle.label,
                url: data.artifactURL
                  .replace(/^.*\/\/[^\/]+:?[0-9]?\//i, AUTHORING_CONTENT_BASE),
              })
              this.subTitles = this.editorService.ordinals.subTitles.filter(
                (v: ISubtitle) => !subtitles.find((j: ISubtitle) => j.srclang === v.srclang))
              this.selectedSubtitle = undefined as any
              this.data.emit({
                ...this.widgetData,
                subtitles,
              })
            }
            this.snackBar.openFromComponent(NotificationComponent, {
              data: {
                type: Notify.UPLOAD_SUCCESS,
              },
              duration: NOTIFICATION_TIME * 1000,
            })
          }
        },
        () => {
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.UPLOAD_FAIL,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
    )
  }

}
