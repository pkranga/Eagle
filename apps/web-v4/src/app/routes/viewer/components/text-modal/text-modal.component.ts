/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-text-modal',
  templateUrl: './text-modal.component.html',
  styleUrls: ['./text-modal.component.scss']
})
export class TextModalComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title?: string; message: string }
  ) {}

  ngOnInit() {}
}
