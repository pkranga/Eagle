/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { IJITResponse } from '../../../../models/training.model';
import { TrainingsService } from '../../../../services/trainings.service';

@Component({
  selector: 'app-training-jit',
  templateUrl: './training-jit.component.html',
  styleUrls: ['./training-jit.component.scss']
})
export class TrainingJitComponent implements OnInit {
  @ViewChild('error', { static: true }) errorSnackbar: TemplateRef<any>;
  jitRequests: IJITResponse[];
  fetchStatus: 'fetching' | 'done' = 'fetching';
  selectedView: 'trainings' | 'jit' = 'trainings';

  constructor(private trainingSvc: TrainingsService, private snackbar: MatSnackBar) {}

  ngOnInit() {
    this.getJITRequests();
  }

  getJITRequests() {
    this.fetchStatus = 'fetching';

    this.trainingSvc.getJITRequests().subscribe(
      requests => {
        this.jitRequests = requests;
        this.fetchStatus = 'done';
      },
      () => {
        this.jitRequests = [];
        this.fetchStatus = 'done';
        this.snackbar.openFromTemplate(this.errorSnackbar);
      }
    );
  }

  openJITForm() {
    this.selectedView = 'jit';
  }

  openJITList() {
    this.selectedView = 'trainings';
  }

  onJITSubmit() {
    this.getJITRequests();
    this.openJITList();
  }
}
