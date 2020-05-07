/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { IFormMeta } from './../../../../../../../../interface/form'
import { AuthInitService } from './../../../../../../../../services/init.service'
import { IprDialogComponent } from '@ws/author/src/lib/modules/shared/components/ipr-dialog/ipr-dialog.component'
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core'
import { FormGroup, FormBuilder, AbstractControl, Validators } from '@angular/forms'
import { MatSnackBar } from '@angular/material'
import { MatDialog } from '@angular/material/dialog'
import { NSContent } from '@ws/author/src/lib/interface/content'
import { Notify } from '@ws/author/src/lib/constants/notificationMessage'
import { NOTIFICATION_TIME } from '@ws/author/src/lib/constants/constant'
import { NotificationComponent } from '@ws/author/src/lib/modules/shared/components/notification/notification.component'
import { ConfigurationsService } from '@ws-widget/utils'
import { URLCheckerClass } from './url-upload.helper'
import { EditorContentService } from '@ws/author/src/lib/routing/modules/editor/services/editor-content.service'

@Component({
  selector: 'ws-auth-url-upload',
  templateUrl: './url-upload.component.html',
  styleUrls: ['./url-upload.component.scss'],
})
export class UrlUploadComponent implements OnInit {
  urlUploadForm!: FormGroup
  iprAccepted = false
  currentContent = ''
  canUpdate = true
  @Input() isSubmitPressed = false
  @Output() data = new EventEmitter<string>()

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private contentService: EditorContentService,
    private configSvc: ConfigurationsService,
    private initService: AuthInitService,
  ) { }

  ngOnInit() {
    this.contentService.changeActiveCont.subscribe(
      data => {
        this.currentContent = data
        this.assignData(this.contentService.getUpdatedMeta(data))
      },
    )
  }

  createForm() {
    this.urlUploadForm = this.formBuilder.group({
      artifactUrl: [''],
      isIframeSupported: ['', Validators.required],
      mimeType: [],
      isInIntranet: ['', Validators.required],
      isExternal: [],
    })
    this.urlUploadForm.valueChanges.subscribe(
      () => {
        if (this.canUpdate) {
          this.storeData()
        }
      },
    )
    this.urlUploadForm.controls.artifactUrl.valueChanges.subscribe(
      () => {
        if (this.canUpdate) {
          this.check()
          this.iprAccepted = false
        }
      },
    )
  }

  assignData(meta: NSContent.IContentMeta) {
    if (!this.urlUploadForm) {
      this.createForm()
    }
    this.canUpdate = false
    this.urlUploadForm.controls.artifactUrl.setValue(meta.artifactUrl || '')
    this.urlUploadForm.controls.mimeType.setValue(meta.mimeType || 'application/html')
    this.urlUploadForm.controls.isIframeSupported.setValue(meta.isIframeSupported || 'No')
    this.urlUploadForm.controls.isInIntranet.setValue(meta.isInIntranet || false)
    this.urlUploadForm.controls.isExternal.setValue(meta.isExternal || true)
    this.canUpdate = true
    if (meta.artifactUrl) {
      this.iprAccepted = true
    }
    if (meta.artifactUrl) {
      this.check()
    } else {
      this.storeData()
    }
    this.urlUploadForm.markAsPristine()
    this.urlUploadForm.markAsUntouched()
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

  submit() {
    if (this.urlUploadForm.controls.artifactUrl.value && !this.iprAccepted) {
      this.snackBar.openFromComponent(NotificationComponent, {
        data: {
          type: Notify.IPR_DECLARATION,
        },
        duration: NOTIFICATION_TIME * 1000,
      })
    } else {
      this.storeData()
      this.data.emit('next')
    }
  }

  storeData() {
    const originalMeta = this.contentService.getOriginalMeta(this.currentContent)
    const currentMeta = this.urlUploadForm.value
    const meta: any = {}
    Object.keys(currentMeta).map(v => {
      if (
        JSON.stringify(currentMeta[v as keyof NSContent.IContentMeta]) !==
        JSON.stringify(originalMeta[v as keyof NSContent.IContentMeta])
      ) {
        if (currentMeta[v] ||
          (
            this.initService.authConfig[v as keyof IFormMeta].type === 'boolean' &&
            meta[v] === false
          )
        ) {
          meta[v] = currentMeta[v]
        } else {
          meta[v] = JSON.parse(
            JSON.stringify(this.initService.authConfig[v as keyof IFormMeta]
              .defaultValue[originalMeta.contentType][0].value),
          )
        }
      }
    })
    this.contentService.setUpdatedMeta(meta, this.currentContent)
  }

  check() {
    let disableIframe = false
    const artifactUrl = this.urlUploadForm.controls.artifactUrl.value
    this.canUpdate = false
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.authoring
      && this.configSvc.instanceConfig.authoring.urlPatternMatching
    ) {
      this.configSvc.instanceConfig.authoring.urlPatternMatching.map(v => {
        if (artifactUrl.match(v.pattern)) {
          if (v.allowIframe) {
            this.urlUploadForm.controls.isIframeSupported.setValue('Yes')
          } else {
            this.urlUploadForm.controls.isIframeSupported.setValue('No')
            this.urlUploadForm.controls.mimeType.setValue('application/html')
            disableIframe = true
          }
          if (v.allowReplace) {
            switch (v.source) {
              case 'youtube':
                this.urlUploadForm.controls.artifactUrl.setValue(URLCheckerClass.youTubeUrlChange(artifactUrl))
                this.urlUploadForm.controls.mimeType.setValue('video/x-youtube')
                break
            }
          }
        }
      })
    }
    this.canUpdate = true
    this.storeData()
    const iframe = this.urlUploadForm.controls.isIframeSupported
    if (disableIframe) {
      iframe.disable()
    } else {
      iframe.enable()
    }
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

}
