/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ws-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  trainingData: any;
  selectedGroup: any;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.data.subscribe(
      allData => {
        this.trainingData = allData.allTrainingData;
      },
      () => {
        this.trainingData = {
          program_groups: [],
          programs: []
        };
      }
    );
  }

  getProgramGroup(programGroup: any) {
    this.router.navigate(['../program-group', { groupId: programGroup.group_id }], {
      relativeTo: this.route
    });
  }
}
