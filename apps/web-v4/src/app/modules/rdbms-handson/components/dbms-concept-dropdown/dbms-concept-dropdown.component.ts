/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RdbmsHandsonService } from '../../services/rdbms-handson.service';
import { IRdbmsApiResponse, IDropdownDetails } from '../../model/rdbms-handson.model';
import { MatSnackBar } from '@angular/material';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { ConfigService } from '../../../../services/config.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-dbms-concept-dropdown',
  templateUrl: './dbms-concept-dropdown.component.html',
  styleUrls: ['./dbms-concept-dropdown.component.scss']
})
export class DbmsConceptDropdownComponent implements OnInit, OnDestroy {

  @Input() resourceContent: IProcessedViewerContent;
  @ViewChild('dbRefreshSuccess', { static: true }) dbRefreshSuccess: ElementRef<any>;
  @ViewChild('dbRefreshFailed', { static: true }) dbRefreshFailed: ElementRef<any>;
  dropdownData: IDropdownDetails[] = [];
  hasFiredRealTimeProgress = false;
  executedResult: IRdbmsApiResponse;
  selectedOption = null;
  dropdownQueryForm: FormGroup;
  contentData: any;
  executed = false;
  loadedTables: any[] = [];
  loading = true;
  errorMessage = '';
  originalQuery = '';
  showTelltext = false;

  options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showPrintMargin: false,
    indentedSoftWrap: false,
    wrap: true
  };
  realTimeProgressTimer: any;
  realTimeProgressRequest: IUserRealTimeProgressUpdateRequest = {
    content_type: 'Resource',
    current: [],
    max_size: 0,
    mime_type: MIME_TYPE.rdbms,
    user_id_type: 'uuid'
  };

  constructor(private formBuilder: FormBuilder,
    private configSvc: ConfigService,
    private userSvc: UserService,
    // tslint:disable-next-line:align
    private snackBar: MatSnackBar,
    // tslint:disable-next-line:align
    private dbmsSvc: RdbmsHandsonService) { }

  ngOnInit() {
    this.dropdownQueryForm = this.formBuilder.group({
    });
    this.contentData = this.resourceContent.rdbms;

    this.initializeDb(false);

    if (this.contentData.dropdown) {
      this.fetchDropdownData();
    } else {
      this.originalQuery = this.contentData.query;
    }
    if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this.raiseRealTimeProgress();
    }
  }

  ngOnDestroy() {
    if (!this.hasFiredRealTimeProgress && this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this._fireRealTimeProgress();
      if (this.realTimeProgressTimer) {
        clearTimeout(this.realTimeProgressTimer);
      }
    }
    if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this.raiseRealTimeProgress();
    }
  }


  initializeDb(flag) {
    this.loading = true;
    this.loadedTables = [];
    this.dbmsSvc.initializeDatabase(this.resourceContent.content.identifier).subscribe(
      res => {
        res.forEach((v, i) => {
          if (v.validationStatus && i > 0) {
            const parsedData = JSON.parse(v.data);
            this.loadedTables.push(
              {
                tableData: parsedData.data,
                tableName: parsedData.tablename,
                tableColumns: Object.keys(parsedData.data[0])
              });
          }
        });
        if (flag) {
          this.snackBar.open(this.dbRefreshSuccess.nativeElement.value);
        }
        this.loading = false;
      }, (err) => {
        this.snackBar.open(this.dbRefreshFailed.nativeElement.value);
      });
  }

  onSelectionChange(index) {
    this.selectedOption = this.dropdownData[index];
    this.originalQuery = this.selectedOption.query;
    this.executedResult = null;
    this.dbmsSvc.tableRefresh(this.resourceContent.content.identifier).subscribe(res => {
      this.loadedTables = [];
      res.forEach((v, i) => {
        if (v.validationStatus) {
          const parsedData = JSON.parse(v.data);
          this.loadedTables.push(
            {
              tableData: parsedData.data,
              tableName: parsedData.tablename,
              tableColumns: Object.keys(parsedData.data[0])
            });
        }
      });
    });
  }

  fetchDropdownData() {
    this.dbmsSvc.fetchConceptData(this.resourceContent.content.identifier).subscribe(res => {
      this.dropdownData = JSON.parse(res.data);
    });
  }

  run() {
    this.executedResult = null;
    // tslint:disable-next-line:max-line-length
    this.showTelltext = this.contentData.dropdown ? (this.originalQuery === this.selectedOption.query) : (this.originalQuery === this.contentData.query);
    const query = this.contentData.dropdown ? this.selectedOption.query : this.contentData.query;
    if (query) {
      this.executed = true;
      if (this.contentData.compositeType) {
        this.dbmsSvc.compositeQuery(query, this.contentData.compositeType).subscribe(res => {
          this.executedResult = res;
          this.executed = false;
        },
          (err) => {
            this.errorMessage = 'Some error occurred. Please try again later!';
            this.executed = false;
          });
      } else {
        this.dbmsSvc.runQuery(query).subscribe(res => {
          this.executedResult = res;
          this.executed = false;
        },
          (err) => {
            this.errorMessage = 'Some error occurred. Please try again later!';
            this.executed = false;
          });
      }
    }
  }

  private raiseRealTimeProgress() {
    this.realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      current: ['1'],
      max_size: 1
    };
    if (this.realTimeProgressTimer) {
      clearTimeout(this.realTimeProgressTimer);
    }
    this.hasFiredRealTimeProgress = false;
    this.realTimeProgressTimer = setTimeout(() => {
      this.hasFiredRealTimeProgress = true;
      this._fireRealTimeProgress();
    }, 2 * 60 * 1000);
  }

  private _fireRealTimeProgress() {
    this.realTimeProgressRequest.content_type = this.resourceContent.content.contentType;
    this.userSvc
      .realTimeProgressUpdate(this.resourceContent.content.identifier, this.realTimeProgressRequest)
      .subscribe();
  }
}
