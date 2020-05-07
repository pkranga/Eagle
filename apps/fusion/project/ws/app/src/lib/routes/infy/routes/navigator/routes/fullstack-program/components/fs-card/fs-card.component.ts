/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { IFsCardModel } from '../../../../models/navigator.model'

@Component({
  selector: 'ws-app-fs-card',
  templateUrl: './fs-card.component.html',
  styleUrls: ['./fs-card.component.scss'],
})
export class FsCardComponent implements OnInit {
  @Input() navigatorCard!: IFsCardModel

  constructor() {
  }

  launchCertification() {
    // console.log('card data', this.navigatorCard)
path

    } else {
      window.open(this.navigatorCard.routeButton)
    }
  }

  ngOnInit() { }
}
