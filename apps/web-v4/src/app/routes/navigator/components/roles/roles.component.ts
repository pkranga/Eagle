/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';
import { NavigatorService } from '../../../../services/navigator.service';
import { RoutingService } from '../../../../services/routing.service';
import { FormControl } from '@angular/forms';
import { FetchStatus } from '../../../../models/status.model';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  nsoData: any;
  searchedRole = [];
  selectedTrack: any;
  selectedRole: any;
  coursesAvailable: boolean;
  rolesDefined: boolean;

  searchedRoles = [];
  searchInprogress = false;
  base = this.configSvc.instanceConfig.platform.appName;

  queryControl = new FormControl('');

  fetchNsoStatus: FetchStatus;

  constructor(public routingSvc: RoutingService, private navSvc: NavigatorService, private configSvc: ConfigService) {}
  ngOnInit() {
    this.queryControl.valueChanges.subscribe(query => {
      if (!query) {
        this.searchedRoles = [];
      } else {
        this.searchRole(query);
      }
    });

    this.fetchNsoStatus = 'fetching';
    this.navSvc.nso.subscribe(
      nsodata => {
        this.fetchNsoStatus = 'done';
        this.nsoData = nsodata;
      },
      err => {
        this.fetchNsoStatus = 'error';
      }
    );
  }

  trackClicked(event: string) {
    this.selectedRole = undefined;
    this.selectedTrack = undefined;

    for (let i = 0; i < this.nsoData.length; i++) {
      if (this.nsoData[i].arm_name === event) {
        this.selectedTrack = this.nsoData[i];
        this.coursesAvailable = this.nsoData[i].courses_available;
        this.rolesDefined = this.nsoData[i].roles_defined;
        // console.log(this.selectedTrack);
        if (this.selectedTrack.roles.length < 2) {
          this.roleClicked(this.selectedTrack.roles[0]);
        }
        break;
      }
    }
  }

  roleClicked(role: any) {
    this.selectedRole = {
      ...role,
      rolesDefined: this.rolesDefined,
      coursesAvailable: this.coursesAvailable
    };
  }

  searchRole(event: string) {
    this.searchInprogress = true;
    this.searchedRoles = [];
    // console.log(this.searchInput);
    if (event.length) {
      this.navSvc.nso.subscribe(
        nsodata => {
          const roles = [];
          nsodata.map(nso => {
            nso.roles.forEach(role => {
              roles.push({
                ...role,
                coursesAvailable: nso.courses_available,
                rolesDefined: nso.roles_defined
              });
            });
          });
          this.searchedRoles = roles.filter(role => {
            // console.log("log ", role);
            return role.role_name.toLowerCase().indexOf(event.toLowerCase()) >= 0;
          });
          this.searchInprogress = false;
        },
        err => {
          this.searchInprogress = false;
        }
      );
    }
  }
}
