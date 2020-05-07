/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { MatDialog } from '@angular/material'
import { BtnKbDialogComponent } from './btn-kb-dialog/btn-kb-dialog.component'
import { ConfigurationsService } from '../../../../utils/src/public-api'
import { NsContent } from '../_services/widget-content.model'

@Component({
  selector: 'ws-widget-btn-kb',
  templateUrl: './btn-kb.component.html',
  styleUrls: ['./btn-kb.component.scss'],
})
export class BtnKbComponent implements OnInit {

  @Input() contentId!: string
  @Input() contentType!: NsContent.EContentTypes
  showBtn = false
  constructor(private dialog: MatDialog, private configSvc: ConfigurationsService) {
  }

  ngOnInit() {
    this.showBtn = this.contentType && this.contentType !== NsContent.EContentTypes.KNOWLEDGE_BOARD
      && NsContent.KB_SUPPORTED_CONTENT_TYPES.includes(this.contentType) &&
      (this.configSvc.userRoles || new Set<string>()).has('kb-curator')
  }

  openPinToKbDialog() {
    this.dialog.open(BtnKbDialogComponent, { data: this.contentId })
  }
}
