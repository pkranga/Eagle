/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Subscription } from 'rxjs'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'ws-invalid-user',
  templateUrl: './invalid-user.component.html',
  styleUrls: ['./invalid-user.component.scss'],
})
export class InvalidUserComponent implements OnInit, OnDestroy {
  private subscriptionData: Subscription | null = null
  invalidData = ''
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.subscriptionData = this.route.data.subscribe(data => {
      this.invalidData = data.pageData.data.value
    })
  }

  ngOnDestroy() {
    if (this.subscriptionData) {
      this.subscriptionData.unsubscribe()
    }
  }

}
