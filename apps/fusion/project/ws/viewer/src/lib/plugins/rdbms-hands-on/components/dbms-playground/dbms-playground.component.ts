/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core'
import { RdbmsHandsOnService } from '../../rdbms-hands-on.service'
import { NSRdbmsHandsOn } from '../../rdbms-hands-on.model'

@Component({
  selector: 'viewer-dbms-playground',
  templateUrl: './dbms-playground.component.html',
  styleUrls: ['./dbms-playground.component.scss'],
})
export class DbmsPlaygroundComponent implements OnInit {

  @Input() resourceContent: any
  @ViewChild('someErrorOccurred', { static: true }) someErrorOccurred: ElementRef<any> | null = null
  options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showPrintMargin: false,
    indentedSoftWrap: false,
    wrap: true,
  }
  userQuery = ''
  executedResult: NSRdbmsHandsOn.IRdbmsApiResponse | null = null
  executed = false
  errorMessage = ''
  loading = true

  constructor(
    private dbmsSvc: RdbmsHandsOnService,
  ) { }

  ngOnInit() {
    this.dbmsSvc.initializeDatabase(this.resourceContent.content.identifier).subscribe()
  }

  run() {
    this.executed = true
    this.dbmsSvc.playground(this.userQuery).subscribe(
      res => {
        this.executedResult = (res as unknown as any[])[0]
        this.executed = false
      },
      _err => {
        this.errorMessage = this.someErrorOccurred ? this.someErrorOccurred.nativeElement.value : ''
        this.executed = false
      })
  }

}
