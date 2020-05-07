/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'

@Component({
  selector: 'ws-widget-completion-spinner',
  templateUrl: './completion-spinner.component.html',
  styleUrls: ['./completion-spinner.component.scss'],
})
export class CompletionSpinnerComponent implements OnInit {

  @Input()
  completed = 0
  @Input()
  outOf = 0
  constructor() { }

  ngOnInit() {
  }

}
