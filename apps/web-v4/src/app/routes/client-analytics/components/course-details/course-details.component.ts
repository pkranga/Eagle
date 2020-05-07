/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Output, Input, EventEmitter,OnChanges } from '@angular/core';
import {Globals} from '../../utils/globals';

export interface PeriodicElement {
  title: string;
  userCount: number;
}

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})

export class CourseDetailsComponent implements OnInit,OnChanges {
  public static _self: CourseDetailsComponent;
  public static type: String;
  moduleUsers = [];
  courseUsers = [];
 resourceUsers = [];
  displayedColumns: string[] = ['title', 'userCount'];
  dataSource;
  @Output() filterEvent = new EventEmitter<string>();
  @Input() data;
  constructor( private globals: Globals) {
    CourseDetailsComponent._self = this;
    // for (let i=0;i<1000;i++){
    //   this.less.push(false);
    //   this.more.push(true);
    // }
   }

  ngOnInit() {    
  }
  ngOnChanges(){
    this.getData(this.data);
  }
    
  public getType(type: String) {
    CourseDetailsComponent.type = type.toLowerCase();
    // if ( type === 'Onsite Offshore' && (this.globals.link === 'Participants' || this.globals.link === 'Lex' || this.globals.link === 'Lab' || this.globals.link === 'Average' )) {
    //   ParticipantPillsComponent.type = 'participants.onsiteOffshoreIndicator';
    // }
    // else if(type === 'Onsite Offshore' && this.globals.link === 'Employees')
    // {
    //   ParticipantPillsComponent.type = 'employees.onsiteOffshoreIndicator';
    // }
  }
  public getfilterEvent() {
    this.filterEvent.emit('Filter Data');
  }
  public filterCourse(item: any) {
     if (this.globals.filter_trend.find(x => x === `"` + CourseDetailsComponent.type + `"` + ':' + `"` + item + `"`) === undefined) {
                                this.globals.filter_trend.push(`"` + CourseDetailsComponent.type + `"` + ':' + `"` + item + `"`);
                             }
   
                             sessionStorage.setItem('Array_Trend', JSON.stringify(this.globals.filter_trend));
                             CourseDetailsComponent._self.getfilterEvent();

  }

  
   getData(data){
      // courseDetails data
    this.moduleUsers = [];
    this.courseUsers = [];
    this.resourceUsers = [];
    this.courseUsers =  data.courseUsers.filter(s => s.content_name)
    .map(m => ({title:m.content_name,userCount:m.no_of_users}));
    this.moduleUsers =  data.moduleUsers.filter(s => s.content_name)
    .map(m => ({title:m.content_name,userCount:m.no_of_users}));
    this.resourceUsers = data.resourceUsers.filter(s => s.content_name)
    .map(m => ({title:m.content_name,userCount:m.no_of_users}));
   }
}
