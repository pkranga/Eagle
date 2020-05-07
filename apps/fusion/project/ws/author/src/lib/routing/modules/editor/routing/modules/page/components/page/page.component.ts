/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IMAGE_MAX_SIZE } from '@ws/author/src/lib/constants/upload'
import { CONTENT_BASE_STATIC } from '@ws/author/src/lib/constants/apiEndpoints'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { IGridLayoutData, responsiveSuffix, sizeSuffix } from '@ws-widget/collection/src/public-api'
import { UploadService } from '@ws/author/src/lib/routing/modules/editor/shared/services/upload.service'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { CdkDragDrop } from '@angular/cdk/drag-drop'
import { PageService } from './page.service'
import { IRenderPage, modelJson, IGridChildData } from './page.model'
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms'
import { MatSnackBar } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { WIDGET_LIBRARY } from './page.constant'
import { AccessControlService } from '@ws/author/src/lib/modules/shared/services/access-control.service'

@Component({
  selector: 'ws-auth-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  providers: [PageService],
})
export class PageComponent implements OnInit {

  contentForm!: FormGroup
  selectedWidget!: IGridChildData
  contentMeta!: NSContent.IContentMeta
  isSubmitPressed = false
  widgetLibrary = WIDGET_LIBRARY
  pageData!: IRenderPage
  containerClass = ''

  constructor(
    private pageService: PageService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private uploadService: UploadService,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private accessService: AccessControlService,
  ) { }

  ngOnInit() {
    this.router.data.subscribe(
      data => {
        this.contentMeta = data.data && data.data.content ? data.data.content : {}
        if (data.json) {
          this.pageData = this.pageService.convertPageToRender(data.data.json)
        }
        this.contentForm = this.formBuilder.group({
          posterImage: [this.contentMeta.posterImage],
          appIcon: [this.contentMeta.appIcon],
          thumbnail: [this.contentMeta.thumbnail],
          name: [this.contentMeta.name],
          description: [this.contentMeta.description],
          artifactUrl: [this.contentMeta.artifactUrl],
        })
      },
    )
    this.pageData = this.pageService.convertPageToRender(modelJson as any)
    if (this.pageData.gutter != null) {
      this.containerClass = `-mx-${this.pageData.gutter}`
    }
  }

  getClassName(data: IGridLayoutData): string {
    const gutterAdjustment = this.pageData.gutter !== null ? `p-${this.pageData.gutter}` : ''
    return Object.entries(data.dimensions).reduce(
      (agg, [k, v]) =>
        `${agg} ${(responsiveSuffix as { [id: string]: string })[k]}:${sizeSuffix[v]}`,
      `${data.className} w-full ${gutterAdjustment}`,
    )
  }

  drop(event: CdkDragDrop<any>) {
    this.pageData.gridList.map(v => {
      v.children.map(j => {
        if (j.id === event.container.id) {
          j.data.widget = JSON.parse(JSON.stringify(event.item.data))
        }
      })
    })
    this.cdr.detectChanges()
  }

  pushGrid(nos: number) {
    this.pageData.gridList.push(this.pageService.pushRow(nos))
  }

  setSelected(data: IGridChildData) {
    this.selectedWidget = data
  }

  isSelected(data: IGridChildData): boolean {
    if (this.selectedWidget) {
      return data.id === this.selectedWidget.id
    }
    return false
  }

  changeToDefaultImg($event: any) {
    $event.target.src = this.accessService.defaultLogo
  }

  delete(row: number) {
    this.pageData.gridList.splice(row, 1)
  }

  convertToFromJson(data: any, mode = 'toJson') {
    if (mode === 'toJson') {
      return data ? JSON.stringify(data) : ''
    }
    setTimeout(() => {
      this.pageData = JSON.parse(JSON.stringify(this.pageData))
      // tslint:disable-next-line:align
    }, 10)
    return data ? JSON.parse(data) : null
  }

  showError(formControl: AbstractControl) {
    if (formControl.invalid) {
      if (this.isSubmitPressed) {
        return true
      }
      if (formControl && formControl.touched) {
        return true
      }
      return false
    }
    return false
  }

  upDateWidgetData(data: any) {
    this.selectedWidget.data.widget.widgetData = data
    this.pageData = JSON.parse(JSON.stringify(this.pageData))
  }

  uploadAppIcon(file: File) {
    const formdata = new FormData()
    const fileName = file.name.replace(/[^A-Za-z0-9.]/g, '')
    if (!(file.type.indexOf('image/') > -1)) {
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

    formdata.append('content', file, fileName)

    this.uploadService.upload(
      formdata,
      { contentId: this.contentMeta.identifier, contentType: CONTENT_BASE_STATIC }).subscribe(
        data => {
          if (data.code) {
            this.contentForm.controls.appIcon.setValue(data.artifactURL)
            this.contentForm.controls.thumbnail.setValue(data.artifactURL)
            this.contentForm.controls.posterImage.setValue(data.artifactURL)
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
