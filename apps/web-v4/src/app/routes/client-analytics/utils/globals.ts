/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

@Injectable({
  providedIn: "root"
}) //there should be something like providedIn root ot
export class Globals {

  filter_trend: String[];
  selectedStartDate;
  selectedEndDate;
  // public toggleDate = false;
  // public link: String;
  public serviceCalled: string;
  // public selectedYear: string;

  // public quarterList = [];
  // data: any;
  // completedToggleStatus: boolean;
  constructor() {
    this.filter_trend = [];
    // this.link = '';

    // this.completedToggleStatus = false;
  }

  ngOnInit() {

  }

}
