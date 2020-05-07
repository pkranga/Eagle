/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { THUMBNAIL_BASE_PATH } from '../../constants/path.constant';

@Component({
  selector: 'app-fs-card',
  templateUrl: './fs-card.component.html',
  styleUrls: ['./fs-card.component.scss']
})
export class FsCardComponent implements OnInit {

  @Input()
  fullStackProgram: any;

  @Input()
  thumbnail: string;

  THUMBNAIL_BASE_PATH = THUMBNAIL_BASE_PATH;

  constructor() {}

  ngOnInit() {
    // console.log(this.fullStackProgram);
  }

}
