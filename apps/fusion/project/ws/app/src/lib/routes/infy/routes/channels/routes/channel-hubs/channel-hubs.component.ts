/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'ws-app-channel-hubs',
  templateUrl: './channel-hubs.component.html',
  styleUrls: ['./channel-hubs.component.scss'],
})
export class ChannelHubsComponent implements OnInit {

  pageData: any
  private baseUrl = `assets/configurations/${location.host.replace(':', '_')}`
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.http.get(`${this.baseUrl}/feature/channel-hubs.json`).subscribe(
      response => {
        this.pageData = response
      },
    )
  }

}
