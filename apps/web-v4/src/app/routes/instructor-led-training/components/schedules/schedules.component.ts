/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SchedulesService } from '../../services/schedules.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { FetchStatus } from '../../../../models/status.model';
import {
  FormControl,
  FormGroup,
  FormBuilder
} from '@angular/forms';
import * as schedules from '../../../../models/schedules.model'
import { AuthService } from '../../../../services/auth.service';
import { UserService } from '../../../../services/user.service';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';
import { MatSnackBar } from '@angular/material';

export interface ScheduleTable {
  courseTitle: string;
  startDate: Date;
  endDate: Date;
  location: string;
  register: string;
}

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss']
})
export class SchedulesComponent implements OnInit, AfterViewInit {
  constructor(
    private schedule: SchedulesService,
    private authSvc: AuthService,
    private userSvc: UserService,
    private regSvc: TrainingsApiService,
    private form1: FormBuilder,
    public matSnackBar: MatSnackBar
  ) {}
  scheduleForm: FormGroup;
  searchForm: FormGroup;
  displayedColumns: string[] = [
    'courseTitle',
    'startDate',
    'endDate',
    'location',
    'register'
  ];
  scheduleFetchStatus: FetchStatus = 'fetching';
  dateStart;
  dateEnd;
  dateObj:schedules.IDateObj;
  scheduleObj:schedules.IScheduleObj;
  registerObj:schedules.IRegisterObj;
  startDate:string;
  endDate:string;
  errorCode:number;
  search:string;
  dataSource;
  scheduleData = [];
  location = [];
  localFilter:string;
  emailId:string;
  status:boolean= false;
  sortedLocation = [];
  locationFilter = [];
  sortedList = [];
  minDate: Date = new Date();
  maxDate: Date = new Date(new Date().getTime() + 86400000 * 90);
  fetching: { [offeringId: string]: boolean } = {};
  locationSet: Set<any>;
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;

  ngOnInit() {
    if (this.authSvc.userEmail.endsWith('EMAIL')) {
      this.userSvc.fetchUserGraphProfile().subscribe(data => {
        this.emailId = data.onPremisesUserPrincipalName.split('@')[0];
      });
    }
    this.startDate =
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);
    this.endDate =
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 2)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);

    this.searchForm = this.form1.group({
      search: ['']
    });

    this.scheduleForm = this.form1.group({
      search: [''],
      dateStart: [''],
      dateEnd: [''],
      location: ['']
    });
  }

  ngAfterViewInit() {
    this.scheduleFetchStatus = 'fetching';
    this.startDate =
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);
    this.endDate =
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 2)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);
    this.dateObj = {
      startDate: this.startDate,
      endDate: this.endDate
    };

    this.schedule.getSchedule(this.dateObj).subscribe(
      res => {
        this.scheduleData = res.hits;
        this.scheduleData = this.scheduleData.map(resData => {
          if (resData.title.length > 30) {
            resData.title = resData.title.substring(0, 30) + '...';
          } else {
            resData.title = resData.title;
          }
          resData.isRegister =
            localStorage.getItem('register_' + resData.intCourseOfferingId) ===
            'true';
          return resData;
        });
        this.scheduleData.forEach(cur => {
          if (cur.location !== 'VIRTUAL CLASSROOM') {
            this.location.push(cur.location);
          }
          this.location.sort();
          this.sortedLocation.push('ALL');
          this.sortedLocation.push('VIRTUAL CLASSROOM');
          this.sortedList = this.sortedLocation.concat(this.location);
          this.locationSet = new Set(this.sortedList);
        });

        this.dataSource = new MatTableDataSource<ScheduleTable>(
          this.scheduleData
        );
        this.dataSource.paginator = this.paginator;
        this.scheduleFetchStatus = 'done';
      },
      err => {
        this.scheduleFetchStatus = 'error';
      }
    );
  }

  openSnackBarDel() {
    if (this.errorCode === 1) {
      this.matSnackBar.open('Deregistered Successfully', 'close', {
        duration: 3000
      });
    } else if (this.errorCode === -12) {
      this.matSnackBar.open('Already deregistered', 'close', {
        duration: 3000
      });
      this.scheduleData = this.scheduleData.map(resData => {
        resData.isRegister =
          localStorage.getItem('register_' + resData.intCourseOfferingId) ===
          'true';
        return resData;
      });
    } else if (this.errorCode === -3) {
      this.matSnackBar.open('Not registered for that course', 'close', {
        duration: 3000
      });
    } else if (this.errorCode === -4) {
      this.matSnackBar.open('Deregisteration date expired', 'close', {
        duration: 3000
      });
    } else {
      this.matSnackBar.open('Some Error Occurred', 'close', {
        duration: 3000
      });
    }
  }

  openSnackBar() {
    if (this.errorCode === 1) {
      this.matSnackBar.open('Registered Successfully', 'close', {
        duration: 3000
      });
    } else if (this.errorCode === -6) {
      this.matSnackBar.open(
        'Another course is registered on that Day',
        'close',
        {
          duration: 3000
        }
      );
    } else if (this.errorCode === -3) {
      this.matSnackBar.open('Already registered', 'close', {
        duration: 3000
      });
      this.scheduleData = this.scheduleData.map(resData => {
        resData.isRegister =
          localStorage.getItem('register_' + resData.intCourseOfferingId) ===
          'false';
        return resData;
      });
    } else if (this.errorCode === -1) {
      this.matSnackBar.open('Course Id does not exists', 'close', {
        duration: 3000
      });
    } else if (this.errorCode === -12) {
      this.matSnackBar.open('Registration failed', 'close', {
        duration: 3000
      });
    } else if (this.errorCode === -13) {
      this.matSnackBar.open('Seats are full', 'close', {
        duration: 3000
      });
    } else if (this.errorCode === -6) {
      this.matSnackBar.open('Pre-requisite are not met', 'close', {
        duration: 3000
      });
    } else if (this.errorCode === -4) {
      this.matSnackBar.open('Registration closed', 'close', {
        duration: 3000
      });
    } else if (this.errorCode === -5) {
      this.matSnackBar.open('Conflicts with the selected date', 'close', {
        duration: 3000
      });
    } else {
      this.matSnackBar.open('Some Error Occurred', 'close', {
        duration: 3000
      });
    }
  }

  applyDateFilter() {
    this.scheduleFetchStatus = 'fetching';
    if (this.scheduleForm.controls.location.value === 'ALL') {
      this.localFilter = '';
    } else {
      this.localFilter = this.scheduleForm.controls.location.value;
    }
    if (this.scheduleForm.controls.dateStart.value === '') {
      this.startDate =
        new Date().getFullYear() +
        '-' +
        ('0' + (new Date().getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + new Date().getDate()).slice(-2);
    } else if (this.scheduleForm.controls.dateEnd.value === '') {
      this.endDate =
        new Date().getFullYear() +
        '-' +
        ('0' + (new Date().getMonth() + 2)).slice(-2) +
        '-' +
        ('0' + new Date().getDate()).slice(-2);
    } else {
      this.startDate =
        this.scheduleForm.controls.dateStart.value.getFullYear() +
        '-' +
        (
          '0' +
          (this.scheduleForm.controls.dateStart.value.getMonth() + 1)
        ).slice(-2) +
        '-' +
        ('0' + this.scheduleForm.controls.dateStart.value.getDate()).slice(-2);
      this.endDate =
        this.scheduleForm.controls.dateEnd.value.getFullYear() +
        '-' +
        ('0' + (this.scheduleForm.controls.dateEnd.value.getMonth() + 1)).slice(
          -2
        ) +
        '-' +
        ('0' + this.scheduleForm.controls.dateEnd.value.getDate()).slice(-2);
    }
    this.search = this.scheduleForm.controls.search.value;
    this.scheduleObj = {
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.localFilter,
      search: this.search
    };
    this.schedule.getSchedule(this.scheduleObj).subscribe(
      res => {
        this.scheduleData = res.hits;
        this.dataSource = new MatTableDataSource<ScheduleTable>(
          this.scheduleData
        );
        this.dataSource.paginator = this.paginator;
        this.scheduleFetchStatus = 'done';
      },
      err => {
        this.scheduleFetchStatus = 'error';
      }
    );
  }
  resetDateFilter() {
    this.scheduleFetchStatus = 'fetching';
    this.endDate =
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 2)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);
    this.startDate =
      new Date().getFullYear() +
      '-' +
      ('0' + (new Date().getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + new Date().getDate()).slice(-2);
    this.localFilter = '';
    this.search = '';
    this.scheduleObj = {
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.localFilter,
      search: this.search
    };
    this.schedule.getSchedule(this.scheduleObj).subscribe(
      res => {
        this.scheduleData = res.hits;
        this.dataSource = new MatTableDataSource<ScheduleTable>(
          this.scheduleData
        );
        this.dataSource.paginator = this.paginator;
        this.scheduleFetchStatus = 'done';
      },
      err => {
        this.scheduleFetchStatus = 'error';
      }
    );
  }
  register(courseId) {
    this.fetching[courseId] = true;
    this.registerObj = {
      courseId,
      emailId: this.emailId
    };
    this.regSvc.register(courseId, this.emailId).subscribe(
      response => {
        this.errorCode = response.res_code;
        this.scheduleData = this.scheduleData.map(resData => {
          if (courseId === resData.intCourseOfferingId) {
            resData.isRegister = true;
            this.openSnackBar();
          }
          localStorage.setItem('register_' + courseId, 'true');
          this.fetching[courseId] = false;
          return resData;
        });
      },
      err => {
        this.errorCode = err.error.res_code;
        this.openSnackBar();

        if (this.errorCode === -6) {
          localStorage.setItem('register_' + courseId, 'true');
        }
        this.fetching[courseId] = false;
      }
    );

  }

  deRegister(courseId) {
    this.fetching[courseId] = true;

    this.registerObj = {
      courseId,
      emailId: this.emailId
    };
    this.regSvc.deregister(courseId, this.emailId).subscribe(
      response => {
        this.errorCode = response.res_code;
        this.scheduleData = this.scheduleData.map(resData => {
          if (courseId === resData.intCourseOfferingId) {
            resData.isRegister = false;
            this.openSnackBarDel();
          }
          localStorage.setItem('register_' + courseId, 'false');
          this.fetching[courseId] = false;
          return resData;
        });
      },
      err => {
        this.errorCode = err.error.res_code;

        this.openSnackBarDel();
        if (this.errorCode === -6) {
          localStorage.setItem('register_' + courseId, 'false');
        }
        this.fetching[courseId] = false;
      }
    );
  }
}
