/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { QuarterServiceService } from '../../services/quarter-service.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-quater-filter',
  templateUrl: './quater-filter.component.html',
  styleUrls: ['./quater-filter.component.scss']
})
export class QuaterFilterComponent implements OnInit {

  @Output() filterEvent = new EventEmitter<string>();
  public config = {
    currentYear: new Date().getFullYear(),
    threshold: 1,
    todaysDate:
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2),
    today: false,
    years: [],
    fromDate: null,
    toDate: null,
    type: 'default',

    quarters: [
      { name: 'Q1', id: 1, color: '' },
      { name: 'Q2', id: 2, color: '' },
      { name: 'Q3', id: 3, color: '' },
      { name: 'Q4', id: 4, color: '' }
    ],
    selectedYear: null,
    selectedQuarters: []
  };
  public quarterOrInput = false;
  dateStart;
  dateEnd;
  startDate = new Date(2019, 3, 1);
  count = 0;
  endDate = new Date();
  constructor(private quarterService: QuarterServiceService) {}

  ngOnInit() {
    this.setInitialYearAndQuarter();
    this.applyDateFilter();
  }
  setInitialYearAndQuarter() {
    try {
      for (let i = 0; i < this.config.threshold; i++) {
        const year = this.config.currentYear + 1 - i;
        const name = year.toString();
        const yearname = 'FY' + name.slice(2);
        const yearOb = {
          key: yearname,
          value: this.config.currentYear - i
        };
        this.config.years.push(yearOb);
      }
      this.config.years.sort(function(a, b) {
        return a.value - b.value ? -1 : 1;
      });
      // this.config.selectedYear = this.config.years[
      //   this.config.years.length - 1
      // ].value;

      const currentQuarter = this.quarterService.getCurrentQuarter()[0]; //
      const allQuarters = [];
      // [3]

      // for (let q = 1; q <= currentQuarter; q++) {
      //   allQuarters.push(q);
      // }
      this.config.selectedQuarters = allQuarters;
    } catch (e) {
      throw e;
    }
  }
  changeYear(year: number) {
    try {
      // validate year
      if (year) {
        // set selected year
        const allQuarters = [];
        // this.config.selectedQuarters = [];
        for (let q = 1; q <= 4; q++) {
          allQuarters.push(q);
        }
        // if (this.config.selectedYear !== null) {
        //     this.config.selectedQuarters = allQuarters ;
        // }
        this.config.selectedYear = year;
        this.config.selectedQuarters = allQuarters;
      }
    } catch (e) {
      throw e;
    }
  }

  toggleInput() {
    try {
      this.quarterOrInput = !this.quarterOrInput;
    } catch (e) {
      console.error(e);
    }
  }
  selectQuarters(quarter: any) {
    try {
      // validate quarter
      if (quarter) {
        // getting all initial values.
        const temp = this.config.selectedQuarters;
        const len = temp.length; // length of the seletced quarters will give us the no.
        const last = temp[len - 1]; // get the last quarter
        const first = temp[0]; // get the first quarter
        /**
         * user can click on quarter to add it and also to remove it.
         * but quarter should be removed only if it is in squence .
         * a quarter if not in sequence is added. all the other quarters that
         * can fill the sequence will be selected too,.
         */

        // if it is in array means we are removing it else adding.\
        // getting type based on if id is present in then remove else add
        const type = temp.indexOf(quarter.id) === -1 ? 'add' : 'remove';
        if (quarter && this.config.selectedYear === null) {
          this.config.selectedYear = this.config.years[
            this.config.years.length - 1
          ].value;
        }
        if (type === 'add') {
          // if nothinig is in array simply add it.
          if (len === 0) {
            this.config.selectedQuarters = [quarter.id];
          } else {
            /**
             * if the quarter id is > last value in the array we will simply
             * start the loop from last+1 to the quarterid and push the values to array.
             * we have to make sure there are no duplicates
             */
            if (quarter.id > last) {
              // copy to temp;
              const newList = temp;
              for (let i = last + 1; i <= quarter.id; i++) {
                if (newList.indexOf(i) === -1) {
                  newList.push(i);
                }
              }
              /**
               * if the selected quarted id is less than the last value in index
               * we will start the loop from quarter id to last number
               * push the values at particular index of array and sort them.
               * remove duplicates
               */
            } else {
              const anotherList = temp;
              for (let j = quarter.id; j < last; j++) {
                if (anotherList.indexOf(j) === -1) {
                  // this is how we add the elemet to a particular index.
                  anotherList.splice(1, 0, j);
                }
              }
              // sort the values to get in the sequence
              anotherList.sort();
            }
          }
        } else {
          // remove
          // if length ==1 remove/pop
          if (len === 1) {
            temp.pop();
          } else {
            // hard code if is first or last. then remove simply at the index.
            if (quarter.id === 1 || quarter.id === 4) {
              const index = temp.indexOf(quarter.id);
              temp.splice(index, 1);
            } else {
              // calculate new last and new first. compare and remove.
              const newLast = temp[temp.length - 1];
              const newFirst = temp[0];
              if (quarter.id === newLast) {
                // pop because it removes last
                temp.pop();
              } else if (quarter.id === newFirst) {
                // shift because it removes first and orders accordingly
                temp.shift();
              } else if (
                quarter.id !== newFirst &&
                quarter.id > newFirst &&
                quarter.id < newLast
              ) {
                for (let c = quarter.id; c < 4; c++) {
                  temp.pop();
                }
              }
            }
          }
        }
        /**
         * the best thing about this function is that objects are pass by reference.
         * the original array inside the this.config.selectedQuarters
         * automatically is updated without even setting it after the work is done here.;
         *
         */
      }
    } catch (e) {
      throw e;
    }
  }
  selectToday() {
    try {
      this.count += 1;
      // this.config.fromDate = this.config.todaysDate;
      this.config.toDate = this.config.todaysDate;
      const today = new Date(this.config.toDate);
      const priorDate = new Date(new Date().setDate(today.getDate() - 30));
      this.config.fromDate =
        priorDate.getFullYear() +
        '-' +
        ('0' + (priorDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + priorDate.getDate()).slice(-2);
      this.dateEnd = new FormControl(new Date(today));
      this.dateStart = new FormControl(new Date(priorDate));
    } catch (e) {
      console.error(e);
    }
  }
  inputChange(type: string, event: MatDatepickerInputEvent<Date>) {
    this.config.type = 'input';
    this.count += 1;
    if (type === 'start') {
      this.config.fromDate = event.value;
    } else {
      this.config.toDate = event.value;
    }
  }

  applyDateFilter() {
    this.count += 1;
    if (this.config.type === 'last30') {
      this.config.selectedYear = null;
      this.config.selectedQuarters = [];

      const obj = {
        from: this.config.fromDate,
        to: this.config.toDate,
        count: this.count
      };
      this.filterEvent.emit(JSON.stringify(obj));
    } else if (this.config.type === 'input') {
      this.config.selectedYear = null;
      this.config.selectedQuarters = [];
      if (this.config.fromDate !== null && this.config.toDate !== null) {
        const obj = {
          from:
            new Date(this.config.fromDate).getFullYear() +
            '-' +
            ('0' + (new Date(this.config.fromDate).getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + new Date(this.config.fromDate).getDate()).slice(-2),
          to:
            new Date(this.config.toDate).getFullYear() +
            '-' +
            ('0' + (new Date(this.config.toDate).getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + new Date(this.config.toDate).getDate()).slice(-2),
          count: this.count
        };
        this.filterEvent.emit(JSON.stringify(obj));
      }
    } else if (this.config.type === 'default') {
      const defaultDates = this.quarterService.getDatesFromQuarters(
        this.config.selectedQuarters,
        this.config.selectedYear
      );
      const reagex = new RegExp('/', 'g');
      defaultDates.startDate = defaultDates.startDate.replace(reagex, '-');
      defaultDates.endDate = defaultDates.endDate.replace(reagex, '-');
      const obj = {
        from: defaultDates.startDate,
        to: defaultDates.endDate,
        count: this.count
      };
      this.filterEvent.emit(JSON.stringify(obj));
    }
  }
}