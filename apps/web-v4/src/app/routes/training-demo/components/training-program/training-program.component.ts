/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingService } from '../../../../services/routing.service';

@Component({
  selector: 'ws-training-program',
  templateUrl: './training-program.component.html',
  styleUrls: ['./training-program.component.scss']
})
export class TrainingProgramComponent implements OnInit {
  programGroup: any;

  constructor(private route: ActivatedRoute, public routingSvc: RoutingService) {}

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.programGroup = data.programGroup;
    });
  }
}
