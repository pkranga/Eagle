/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { UtilityService } from '../../../../services/utility.service';
import { ILeader } from '../../../../models/leadership.model';

@Component({
  selector: 'ws-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  @Input() about: string;
  @Input() profile: ILeader;
  isLiked = false;
  constructor(private utilSvc: UtilityService) { }

  ngOnInit() {
  }

  featureUnavailable() {
    this.utilSvc.featureUnavailable();
  }
}
