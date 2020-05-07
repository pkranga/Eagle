/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { THUMBNAIL_BASE_PATH } from '../../constants/path.constant';

@Component({
  selector: 'app-role-card',
  templateUrl: './role-card.component.html',
  styleUrls: ['./role-card.component.scss']
})
export class RoleCardComponent implements OnInit, OnChanges {
  THUMBNAIL_BASE_PATH = THUMBNAIL_BASE_PATH;

  @Input()
  role: any;

  selectedVariant: any;
  showFullDescription = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // console.log(this.role);
  }

  ngOnChanges() {
    this.selectedVariant = { ...this.role.variants[0] };
  }

  navigate(url: string) {
    let qparams = {};
    if (this.selectedVariant) {
      qparams = { variant: this.selectedVariant.variant_id };
    }
    // this.router.navigate(url, qparams);
  }

  onSelectionChange(entry) {
    this.selectedVariant = entry;
  }
}
