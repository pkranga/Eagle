/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoutingService } from '../../../../services/routing.service';

@Component({
  selector: 'ws-unconscious-bias',
  templateUrl: './unconscious-bias.component.html',
  styleUrls: ['./unconscious-bias.component.scss']
})
export class UnconsciousBiasComponent implements OnInit {
  constructor(private http: HttpClient, public routingSvc: RoutingService) {}
  json;
  ngOnInit() {
    this.http.get<any>('/public-assets/common/siemens/unconscious-bias/unconscious-bias.siemens.json').subscribe(data => {
      this.json = data;
    });
  }
}
