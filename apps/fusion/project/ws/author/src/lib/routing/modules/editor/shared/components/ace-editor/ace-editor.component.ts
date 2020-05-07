/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core'
import 'brace'
import 'brace/ext/language_tools'
import 'brace/mode/json'
import 'brace/snippets/json'
import 'brace/theme/textmate'

@Component({
  selector: 'ws-auth-ace-editor',
  templateUrl: './ace-editor.component.html',
  styleUrls: ['./ace-editor.component.scss'],
})
export class AceEditorComponent implements OnInit {

  id = new Date().toISOString()
  @Input() mode = 'json'
  text: any
  @Input() set content(data: any) {
    this.text = JSON.stringify(data, null, '\t')
  }
  @Output() data = new EventEmitter<any>()
  options: any = {
    maxLines: 'Infinity',
    printMargin: false,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showInvisibles: false,
    showGutter: true,
    showLineNumbers: false,
  }
  @ViewChild('editor', { static: false }) editor!: any

  constructor() { }

  onChange(data: any) {
    try {
      this.data.emit(JSON.parse(data || {}))
    } catch (ex) {

    }
  }

  ngOnInit() {
  }

}
