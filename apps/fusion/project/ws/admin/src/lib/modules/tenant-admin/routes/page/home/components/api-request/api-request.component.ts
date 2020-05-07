/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, EventEmitter, Output } from '@angular/core'

@Component({
  selector: 'ws-admin-api-request',
  templateUrl: './api-request.component.html',
  styleUrls: ['./api-request.component.scss'],
})
export class ApiRequestComponent implements OnInit {
  @Output() apiRequest = new EventEmitter<any>()
  api: any = {
    path: '',
    queryParams: {
      pageNo: 0,
      pageSize: 30,
    },
  }
  constructor() { }

  ngOnInit() { }

  save() {
    const request = {
      api: this.api,
    }
    this.apiRequest.emit(request)
    this.api.path = ''
  }
}
