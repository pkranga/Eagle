/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { IReleaseNotes } from './release-notes.model'
@Component({
  selector: 'ws-widget-release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss'],
})
export class ReleaseNotesComponent extends WidgetBaseComponent implements OnInit, NsWidgetResolver.IWidgetData<IReleaseNotes> {
  @Input() widgetData!: IReleaseNotes
  constructor() {
    super()
  }

  ngOnInit() {

  }

}
