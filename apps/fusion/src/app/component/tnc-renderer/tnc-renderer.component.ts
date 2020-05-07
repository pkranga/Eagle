/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, Output, EventEmitter, OnChanges, OnInit } from '@angular/core'
import { NsTnc } from '../../models/tnc.model'

@Component({
  selector: 'ws-tnc-renderer',
  templateUrl: './tnc-renderer.component.html',
  styleUrls: ['./tnc-renderer.component.scss'],
})
export class TncRendererComponent implements OnInit, OnChanges {

  @Input() tncData: NsTnc.ITnc | null = null
  @Output() tncChange = new EventEmitter<string>()
  @Output() dpChange = new EventEmitter<string>()

  generalTnc: NsTnc.ITncUnit | null = null
  dpTnc: NsTnc.ITncUnit | null = null

  // UI Vars
  currentPanel: 'tnc' | 'dp' = 'tnc'
  constructor() { }

  ngOnInit() {
    if (this.tncData) {
      const tncData = this.tncData
      this.assignGeneralAndDp()
      if (!tncData.isAccepted && this.dpTnc && !this.dpTnc.isAccepted) {
        this.currentPanel = 'dp'
      }
      if (!tncData.isAccepted && this.generalTnc && !this.generalTnc.isAccepted) {
        this.currentPanel = 'tnc'
      }
    }
  }

  ngOnChanges() {
    if (this.tncData) {
      this.assignGeneralAndDp()
    }
  }
  private assignGeneralAndDp() {
    if (this.tncData) {
      this.tncData.termsAndConditions.forEach(tnc => {
        if (tnc.name === 'Generic T&C') {
          this.generalTnc = tnc
        } else {
          this.dpTnc = tnc
        }
      })
    }
  }

  reCenterPanel() {
    const tncPointer = document.getElementById('tnc')
    if (tncPointer) {
      tncPointer.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  changeTncLang(locale: string) {
    this.tncChange.emit(locale)
  }
  changeDpLang(locale: string) {
    this.dpChange.emit(locale)
  }

}
