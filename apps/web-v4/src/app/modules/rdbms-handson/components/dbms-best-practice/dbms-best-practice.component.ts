/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { RdbmsHandsonService } from '../../services/rdbms-handson.service';
import { IRdbmsApiResponse, IDropdownDetails, IDbStructureResponse, IInitializeDBTable } from '../../model/rdbms-handson.model';
import { MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { ConfigService } from '../../../../services/config.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-dbms-best-practice',
  templateUrl: './dbms-best-practice.component.html',
  styleUrls: ['./dbms-best-practice.component.scss']
})
export class DbmsBestPracticeComponent implements OnInit, OnDestroy {

  @Input() resourceContent: IProcessedViewerContent;
  @ViewChild('dbRefreshSuccess', { static: true }) dbRefreshSuccess: ElementRef<any>;
  @ViewChild('dbRefreshFailed', { static: true }) dbRefreshFailed: ElementRef<any>;
  contentData: any;
  hasFiredRealTimeProgress = false;
  originalQueryResult: IRdbmsApiResponse;
  loadedTables: IInitializeDBTable[] = [];
  enhancedQueryResult: IRdbmsApiResponse;
  dropdownData: IDropdownDetails[] = [];
  telltext = '';
  errorMessage = '';
  initialLoading = false;
  selectedOption: any;
  dbStructure: IDbStructureResponse[] = [];
  executed = false;
  dropdownQueryForm: FormGroup;
  realTimeProgressTimer: any;
  realTimeProgressRequest: IUserRealTimeProgressUpdateRequest = {
    content_type: 'Resource',
    current: [],
    max_size: 0,
    mime_type: MIME_TYPE.rdbms,
    user_id_type: 'uuid'
  };
  constructor(private dbmsSvc: RdbmsHandsonService,
    // tslint:disable-next-line:align
    private configSvc: ConfigService,
    // tslint:disable-next-line:align
    private userSvc: UserService,
    // tslint:disable-next-line:align
    private snackBar: MatSnackBar,
    // tslint:disable-next-line:align
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.dropdownQueryForm = this.formBuilder.group({
    });
    this.contentData = this.resourceContent.rdbms;
    this.initializeDb(false);
    if (this.contentData.dropdown) {
      this.fetchDropdownData();
    } else {
      this.selectedOption = { originalQuery: this.contentData.originalQuery, enhancedQuery: this.contentData.enhancedQuery };
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
    this.initialLoading = true;
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
        // this.dbmsSvc.fetchDBStructure(this.resourceContent.content.identifier).subscribe(
        //   result => {
        //     this.dbStructure = result.data ? JSON.parse(result.data) : [];
        //     this.initialLoading = false;
        //   },
        //   (err) => {
        //     this.initialLoading = false;
        //   });
        if (flag) {
          this.snackBar.open(this.dbRefreshSuccess.nativeElement.value);
        }
        this.initialLoading = false;
      }, (err) => {
        this.snackBar.open(this.dbRefreshFailed.nativeElement.value);
        this.initialLoading = false;
      });
  }

  onSelectionChange(index) {
    this.selectedOption = this.dropdownData[index];
    this.selectedOption.originalQuery = this.selectedOption.query.Enhanced;
    this.selectedOption.enhancedQuery = this.selectedOption.query.original;
    this.telltext = this.selectedOption.telltext;
    this.originalQueryResult = null;
    this.enhancedQueryResult = null;
  }

  fetchDropdownData() {
    this.dbmsSvc.fetchConceptData(this.resourceContent.content.identifier).subscribe(res => {
      this.dropdownData = JSON.parse(res.data);
    });
  }

  run(flag) {
    this.executed = true;
    const query = flag ? this.selectedOption.originalQuery : this.selectedOption.enhancedQuery;
    this.dbmsSvc.runQuery(query).subscribe(res => {
      if (flag) {
        this.originalQueryResult = res;
      } else {
        this.enhancedQueryResult = res;
      }
      this.executed = false;
    },
      (err) => {
        this.errorMessage = 'Some error occurred. Please try again later!';
        this.executed = false;
      });
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
