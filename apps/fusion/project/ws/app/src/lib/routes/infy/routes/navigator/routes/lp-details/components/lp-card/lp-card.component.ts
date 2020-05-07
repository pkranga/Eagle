/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IPractiseCardModel } from '../../../../models/navigator.model'

@Component({
  selector: 'ws-app-lp-card',
  templateUrl: './lp-card.component.html',
  styleUrls: ['./lp-card.component.scss'],
})
export class LpCardComponent implements OnInit {
  @Input() navigatorCard!: IPractiseCardModel

  constructor() { }

  ngOnInit() { }

  launchCertification() {
    // console.log('card data', this.navigatorCard)
    window.open(this.navigatorCard.routeButton)
  }
}
