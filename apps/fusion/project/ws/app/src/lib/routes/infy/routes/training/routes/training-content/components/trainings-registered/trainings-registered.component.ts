/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core'
import { ITraining, ITrainingUserPrivileges } from '../../../../models/training-api.model'

@Component({
  selector: 'ws-app-trainings-registered',
  templateUrl: './trainings-registered.component.html',
  styleUrls: ['./trainings-registered.component.scss'],
})
export class TrainingsRegisteredComponent implements OnInit {
  @Input() registeredTrainings!: ITraining[]
  @Input() trainingPrivileges: ITrainingUserPrivileges
  @Output() deregistered: EventEmitter<number>

  constructor() {
    this.deregistered = new EventEmitter()
    this.trainingPrivileges = {
      canNominate: false,
      canRequestJIT: false,
    }
  }

  ngOnInit() {}

  onDeregister(trainingId: number) {
    this.deregistered.emit(trainingId)
  }
}
