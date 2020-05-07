/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { FormGroup } from '@angular/forms'
import { MatDialog, MatSnackBar } from '@angular/material'
import { ActivatedRoute, Router } from '@angular/router'
import { VIEWER_ROUTE_FROM_MIME } from '@ws-widget/collection'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NSApiRequest } from '@ws/author/src/lib/interface/apiRequest'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { CommentsDialogComponent } from '@ws/author/src/lib/modules/shared/components/comments-dialog/comments-dialog.component'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { EditorContentService } from '@ws/author/src/lib/routing/modules/editor/services/editor-content.service'
import { EditorService } from '@ws/author/src/lib/routing/modules/editor/services/editor.service'
import { LoaderService } from '@ws/author/src/lib/services/loader.service'
import { of } from 'rxjs'
import { mergeMap, tap } from 'rxjs/operators'

@Component({
  selector: 'ws-auth-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {

  contents: NSContent.IContentMeta[] = []
  currentContent = ''
  currentStep = 2
  allLanguages!: any[]
  disableCursor = false
  previewMode = false
  mimeTypeRoute: any
  canTransCode = true
  showSettingButtons = true
  isChanged = false
  isSubmitPressed = false
  constructor(
    private activateRoute: ActivatedRoute,
    private contentService: EditorContentService,
    private snackBar: MatSnackBar,
    private editorService: EditorService,
    private dialog: MatDialog,
    private router: Router,
    private loaderService: LoaderService,
  ) { }

  ngOnInit() {
    this.activateRoute.data.subscribe(
      data => {
        this.allLanguages = data.ordinals.subTitles
        this.canTransCode =
          data.ordinals.canTransCode &&
            data.ordinals.canTransCode.length &&
            data.ordinals.canTransCode[0]
            ? data.ordinals.canTransCode[0]
            : false
      },
    )
    Object.keys(this.contentService.originalContent).map(
      v => this.contents.push(this.contentService.originalContent[v]),
    )
    if (this.contents[0] && this.contents[0].artifactUrl) {
      this.currentStep = 3
    }
    this.contentService.changeActiveCont.subscribe(
      data => this.currentContent = data,
    )
    this.loaderService.changeLoadState(true)
  }

  customStepper(step: number) {
    if (step === 1) {
      this.disableCursor = true
    } else if ((this.currentStep === 2 && step !== 2) && !this.contentService.getUpdatedMeta(this.currentContent).artifactUrl) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.UPLOAD_FILE,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    } else {
      this.currentStep = step
    }
  }

  createInAnotherLanguage(language: string) {
    this.loaderService.changeLoad.next(true)
    const meta = { artifactUrl: '' }
    this.contentService.createInAnotherLanguage(language, meta).subscribe(
      data => {
        this.loaderService.changeLoad.next(false)
        if (data !== true) {
          this.contents.push(data as NSContent.IContentMeta)
          this.changeContent(data as NSContent.IContentMeta)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.CONTENT_CREATE_SUCCESS,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        } else {
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.DATA_PRESENT,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        }
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

  changeContent(content: NSContent.IContentMeta) {
    this.contentService.changeActiveCont.next(content.identifier)
  }

  save() {
    const updatedContent = this.contentService.upDatedContent[this.currentContent] || {}
    if (Object.keys(updatedContent).length) {
      this.isChanged = true
      this.loaderService.changeLoad.next(true)
      this.triggerSave(updatedContent, this.currentContent).subscribe(
        () => {
          this.loaderService.changeLoad.next(false)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.SAVE_SUCCESS,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
        () => {
          this.loaderService.changeLoad.next(false)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: Notify.SAVE_FAIL,
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
      )
    } else {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.UP_TO_DATE,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    }
  }

  get validationCheck(): boolean {
    let returnValue = true
    if (!this.contentService.isValid(this.currentContent)) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.MANDATORY_FIELD_ERROR,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
      returnValue = false
    }
    if (!this.contentService.getUpdatedMeta(this.currentContent).artifactUrl) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.UPLOAD_FILE,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
      returnValue = false
    }
    return returnValue
  }

  takeAction() {
    const needSave = Object.keys((this.contentService.upDatedContent[this.currentContent] || {})).length
    if (!needSave &&
      (this.contentService.getUpdatedMeta(this.currentContent).status === 'Live' && !this.isChanged)
    ) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.UP_TO_DATE,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
      return
    }
    if (this.validationCheck) {
      const dialogRef = this.dialog.open(CommentsDialogComponent, {
        width: '750px',
        height: '450px',
        data: this.contentService.getOriginalMeta(this.currentContent),
      })

      dialogRef.afterClosed().subscribe((commentsForm: FormGroup) => {
        this.finalCall(commentsForm)
      })
    }
  }

  finalCall(commentsForm: FormGroup) {
    if (commentsForm) {
      const body: NSApiRequest.IForwadBackwardActionGeneral = {
        comment: commentsForm.controls.comments.value,
        operation:
          (
            commentsForm.controls.action.value === 'accept' ||
            this.contentService.originalContent[this.currentContent].status === 'Draft'
          )
            ? 1
            : -1,
      }

      const updatedContent = this.contentService.upDatedContent[this.currentContent] || {}
      const needSave = Object.keys((this.contentService.upDatedContent[this.currentContent] || {})).length
      const saveCall = (
        needSave ? this.triggerSave(updatedContent, this.currentContent) : of({} as any)
      ).pipe(mergeMap(() => this.editorService.forwardBackward(body, this.currentContent)))
      this.loaderService.changeLoad.next(true)
      saveCall.subscribe(
        () => {
          this.loaderService.changeLoad.next(false)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: this.getMessage('success'),
            },
            duration: NOTIFICATION_TIME * 1000,
          })
          this.contents = this.contents.filter(v => v.identifier !== this.currentContent)
          if (this.contents.length) {
            this.contentService.changeActiveCont.next(this.contents[0].identifier)
          } else {
            this.router.navigateByUrl('/author/home')
          }
        },
        () => {
          this.loaderService.changeLoad.next(false)
          this.snackBar.openFromComponent(NotificationComponent, {
            data: {
              type: this.getMessage('failure'),
            },
            duration: NOTIFICATION_TIME * 1000,
          })
        },
      )
    }
  }

  preview() {
    const updatedContent = this.contentService.upDatedContent[this.currentContent] || {}
    const saveCall = (Object.keys(updatedContent).length
      ? this.triggerSave(updatedContent, this.currentContent)
      : of({} as any)
    )
    this.loaderService.changeLoad.next(true)
    saveCall.subscribe(
      () => {
        this.loaderService.changeLoad.next(false)
        this.previewMode = true
        this.mimeTypeRoute = VIEWER_ROUTE_FROM_MIME(
          this.contentService.getUpdatedMeta(this.currentContent).mimeType as any,
        )
        // this.viewerDataSvc.updateResource(
        //   this.contentService.getUpdatedMeta(this.currentContent) as any, null)
        // this.router.navigate(
        //   [
        //     `viewer/${VIEWER_ROUTE_FROM_MIME(
        //       this.contentService.getUpdatedMeta(this.currentContent).mimeType as any)}/${
        //     this.currentContent
        //     }`,
        //   ],
        //   {
        //     queryParams: { preview: true },
        //     relativeTo: this.activateRoute,
        //   },
        // )
      },
      () => {
        this.loaderService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.SAVE_FAIL,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
      },
    )
  }

  closePreview() {
    this.previewMode = false
    // this.router.navigate(['/'], { relativeTo: this.activateRoute })
  }

  toggleSettingButtons() {
    this.showSettingButtons = !this.showSettingButtons
  }

  triggerSave(meta: NSContent.IContentMeta, id: string) {
    const requestBody: NSApiRequest.IContentUpdate = {
      hierarchy: {},
      nodesModified: {
        [id]: {
          isNew: false,
          root: true,
          metadata: meta,
        },
      },
    }
    return this.editorService.updateContent(requestBody).pipe(
      tap(() => this.contentService.resetOriginalMeta(meta, id)))
  }

  getMessage(type: 'success' | 'failure') {
    if (type === 'success') {
      switch (this.contentService.originalContent[this.currentContent].status) {
        case 'Draft':
        case 'Live':
          return Notify.SEND_FOR_REVIEW_SUCCESS
        case 'InReview':
          return Notify.REVIEW_SUCCESS
        case 'Reviewed':
          return Notify.PUBLISH_SUCCESS
        default:
          return ''
      }
    }
    switch (this.contentService.originalContent[this.currentContent].status) {
      case 'Draft':
      case 'Live':
        return Notify.SEND_FOR_REVIEW_FAIL
      case 'InReview':
        return Notify.REVIEW_FAIL
      case 'Reviewed':
        return Notify.PUBLISH_FAIL
      default:
        return ''
    }
  }

  action(type: string) {
    switch (type) {

      case 'next':
        this.currentStep += 1
        break

      case 'preview':
        this.preview()
        break

      case 'save':
        this.save()
        break

      case 'push':
        this.takeAction()
        break

      case 'delete':
        this.delete()
        break

      case 'close':
        this.router.navigateByUrl('/author/home')
        break
    }
  }

  delete() {
    this.loaderService.changeLoad.next(true)
    this.editorService.deleteContent(this.currentContent).subscribe(
      () => {
        this.loaderService.changeLoad.next(false)
        this.snackBar.openFromComponent(NotificationComponent, {
          data: {
            type: Notify.SUCCESS,
          },
          duration: NOTIFICATION_TIME * 1000,
        })
        this.contents = this.contents.filter(v => v.identifier !== this.currentContent)
        if (this.contents.length) {
          this.contentService.changeActiveCont.next(this.contents[0].identifier)
        } else {
          this.router.navigateByUrl('/author/home')
        }
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

  fullScreenToggle = () => {
    const doc: any = document
    const elm: any = doc.getElementById('upload-container')
    if (elm.requestFullscreen) {
      (!doc.fullscreenElement ? elm.requestFullscreen() : doc.exitFullscreen())
    } else if (elm.mozRequestFullScreen) {
      (!doc.mozFullScreen ? elm.mozRequestFullScreen() : doc.mozCancelFullScreen())
    } else if (elm.msRequestFullscreen) {
      (!doc.msFullscreenElement ? elm.msRequestFullscreen() : doc.msExitFullscreen())
    } else if (elm.webkitRequestFullscreen) {
      (!doc.webkitIsFullscreen ? elm.webkitRequestFullscreen() : doc.webkitCancelFullscreen())
    }
  }

  getAction(): string {
    if (this.contentService.originalContent[this.currentContent].contentType === 'Knowledge Artifact') {
      return 'publish'
    }
    switch (this.contentService.originalContent[this.currentContent].status) {
      case 'Draft':
      case 'Live':
        return 'sendForReview'
      case 'InReview':
        return 'review'
      case 'Reviewed':
        return 'publish'
      default:
        return 'sendForReview'
    }
  }
}
