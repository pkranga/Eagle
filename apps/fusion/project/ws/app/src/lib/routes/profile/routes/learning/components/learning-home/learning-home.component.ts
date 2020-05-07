/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-app-learning-home',
  templateUrl: './learning-home.component.html',
  styleUrls: ['./learning-home.component.scss'],
})
export class LearningHomeComponent implements OnInit {
  enabledTab = this.activatedRoute.snapshot.data.pageData.data.enabledTabs.learning.subTabs

  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

}
