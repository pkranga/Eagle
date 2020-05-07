/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {Globals} from '../../utils/globals';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm: FormGroup;
  public static type: any ;
  @Output() filterEvent = new EventEmitter<string>();

  constructor(private form: FormBuilder,
    public globals:Globals,
    public matSnackBar: MatSnackBar,

  ) { }

  ngOnInit() {
    this.searchForm = this.form.group({
      search: ['', Validators],
    });
  }
  public updateType (type: String) {
    SearchComponent.type = type;
 }
 openSnackBar(){
  this .matSnackBar.open('Please enter a resource', 'close', {
    duration: 3000
  });
}
  search(filter:string) {
    if(filter==='')
    {
      this.openSnackBar(); 
    } else if(filter===undefined)
    {
      filter='';
    }
    else{
      if (this.globals.filter_trend.find(x => x === `"` + 'Search' + `"` + ':' + `"` + filter + `"`) === undefined) {
        this.globals.filter_trend.push(`"` + 'Search' + `"` + ':' + `"` + filter + `"`);
    }
    
  }
sessionStorage.setItem('Array_Trend', JSON.stringify(this.globals.filter_trend));
    this.getfilterEvent();

  }
  public getfilterEvent() {
    this.filterEvent.emit('Filter Data');
  }
}
