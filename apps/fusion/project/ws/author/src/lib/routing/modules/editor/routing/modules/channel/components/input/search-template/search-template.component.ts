/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'ws-auth-search-template',
  templateUrl: './search-template.component.html',
  styleUrls: ['./search-template.component.scss'],
})
export class SearchTemplateComponent implements OnInit {

  @Input() content!: any
  @Output() data = new EventEmitter<any>()
  constructor() { }

  ngOnInit() {
  }

}
