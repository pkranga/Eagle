/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';

@Component({
  selector: 'ws-training-demo',
  templateUrl: './training-demo.component.html',
  styleUrls: ['./training-demo.component.scss']
})
export class TrainingDemoComponent implements OnInit {
  @Input() content: IContent;
  program: any;

  constructor(private trainingApi: TrainingsApiService) {}

  ngOnInit() {
    if (!this.content.trainingProgram) {
      this.trainingApi.getProgramTrainings(this.content.identifier).subscribe(training => {
        this.content.trainingProgram = training;
      });
    }
  }
}
