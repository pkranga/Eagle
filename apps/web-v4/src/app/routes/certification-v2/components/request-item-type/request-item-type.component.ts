/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { TCertificationRequestType } from '../../../../models/certification.model';

@Component({
  selector: 'ws-request-item-type',
  templateUrl: './request-item-type.component.html',
  styleUrls: ['./request-item-type.component.scss']
})
export class RequestItemTypeComponent implements OnInit {
  @Input() itemType: TCertificationRequestType;

  constructor() {}

  ngOnInit() {}
}
