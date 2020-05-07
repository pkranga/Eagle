/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { IJITRequest } from '../../../../models/training-api.model'
import { TrainingApiService } from '../../../../apis/training-api.service'

@Component({
  selector: 'ws-app-jit-list',
  templateUrl: './jit-list.component.html',
  styleUrls: ['./jit-list.component.scss'],
})
export class JitListComponent implements OnInit {
  jitRequests!: IJITRequest[]
  fetchStatus: 'fetching' | 'done' = 'fetching'
  selectedView: 'trainings' | 'jit' = 'trainings'

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private trainingsApi: TrainingApiService,
  ) {}

  ngOnInit() {
    this.getJITRequests()
  }

  getJITRequests() {
    this.fetchStatus = 'fetching'

    this.trainingsApi.getJITRequests().subscribe(
      requests => {
        this.jitRequests = requests
        this.fetchStatus = 'done'
      },
      () => {
        this.jitRequests = []
        this.fetchStatus = 'done'
      },
    )
  }

  openJITForm() {
    this.router.navigate(['../request-training'], { relativeTo: this.route })
  }
}
