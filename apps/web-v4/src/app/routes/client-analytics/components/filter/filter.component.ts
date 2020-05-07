/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Globals } from '../../utils/globals';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  public refinedList: any;
  public tempStorage = [];
  public filterList=[];
  public removable = true;
  @Output() filterEvent = new EventEmitter<string>();
  constructor(private globals: Globals) { }

  ngOnInit() {
  }

  public getFilter() {
    this.refinedList = JSON.parse(JSON.stringify(this.globals.filter_trend));

    this.refinedList = this.refinedList.filter(item => item !== `"isTrackETA":"True"`);
    this.refinedList = this.refinedList.filter(item => item !== `"is_completed":"Y"`);
    this.refinedList = this.refinedList.filter(item => item !== `"isTalentGrid":'True'`);

    // this.refinedList.map(filter=>{
    //   filter=filter.split(":")[1].replace(/"/g, "");
    //   this.filterList.push(filter);
    // });
    return this.refinedList;

  }

  public deleteFilter(filter: String) {
    const i = this.globals.filter_trend.indexOf(filter);
    this.globals.filter_trend = this.globals.filter_trend.filter(item => item !== filter);

    sessionStorage.removeItem('Array_Trend');
    sessionStorage.setItem('Array_Trend', JSON.stringify(this.globals.filter_trend));

  }

  public getfilterEvent() {
    this.filterEvent.emit('Filter Data');
  }
  //
  public deleteAllFilter(filter: String) {


    this.globals.filter_trend.forEach(item => {
      if (item.startsWith("'is")) {
        this.tempStorage.push(item)
      }
    });
    this.globals.filter_trend = this.tempStorage;
    sessionStorage.removeItem('Array_Trend');
    sessionStorage.setItem('Array_Trend', JSON.stringify(this.tempStorage));
  }


}
