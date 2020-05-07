/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { ETrainingType } from '../../models/training.model'

@Component({
  selector: 'ws-app-training-type',
  templateUrl: './training-type.component.html',
  styleUrls: ['./training-type.component.scss'],
})
export class TrainingTypeComponent implements OnInit {
  @Input() trainingType!: ETrainingType
  trainingTypes: typeof ETrainingType

  constructor() {
    this.trainingTypes = ETrainingType
  }

  ngOnInit() {}
}
