/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { TourService } from 'ngx-tour-md-menu'

@Component({
  selector: 'ws-widget-ws-tour',
  templateUrl: './tour-guide.component.html',
  styleUrls: ['./tour-guide.component.scss'],
})
export class TourComponent implements OnInit {

  constructor(public tourService: TourService) {
  }
  ngOnInit() {
  }

}
