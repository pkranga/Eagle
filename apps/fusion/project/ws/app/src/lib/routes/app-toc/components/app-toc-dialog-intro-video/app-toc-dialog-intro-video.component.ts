/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { ROOT_WIDGET_CONFIG } from '@ws-widget/collection'
import { NsWidgetResolver } from '@ws-widget/resolver'

@Component({
  selector: 'ws-app-app-toc-dialog-intro-video',
  templateUrl: './app-toc-dialog-intro-video.component.html',
  styleUrls: ['./app-toc-dialog-intro-video.component.scss'],
})
export class AppTocDialogIntroVideoComponent implements OnInit {
  introVideoRenderConfig: NsWidgetResolver.IRenderConfigWithTypedData<any> | null = null
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<AppTocDialogIntroVideoComponent>,
  ) { }

  ngOnInit() {
    this.introVideoRenderConfig = {
      widgetData: {
        url: this.data,
        autoplay: true,
      },
      widgetSubType: ROOT_WIDGET_CONFIG.player.video,
      widgetType: ROOT_WIDGET_CONFIG.player._type,
      widgetHostClass: 'video-full block',
      widgetHostStyle: {
        height: '350px',
      },
    }
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
