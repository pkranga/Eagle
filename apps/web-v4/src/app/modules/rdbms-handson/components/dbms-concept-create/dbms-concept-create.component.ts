/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RdbmsHandsonService } from '../../services/rdbms-handson.service';
import { IRdbmsApiResponse, IDropdownDetails } from '../../model/rdbms-handson.model';

import 'brace';
import 'brace/ext/language_tools';

import 'brace/mode/sql';
import 'brace/snippets/sql';
import { MatSnackBar } from '@angular/material';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { ConfigService } from '../../../../services/config.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-dbms-concept-create',
  templateUrl: './dbms-concept-create.component.html',
  styleUrls: ['./dbms-concept-create.component.scss']
})
export class DbmsConceptCreateComponent implements OnInit, OnDestroy {

  @Input() resourceContent: IProcessedViewerContent;
  @ViewChild('dbRefreshSuccess', { static: true }) dbRefreshSuccess: ElementRef<any>;
  @ViewChild('dbRefreshFailed', { static: true }) dbRefreshFailed: ElementRef<any>;
  executedResult: IRdbmsApiResponse;
  queryForm: FormGroup;
  dropdownData: IDropdownDetails[] = [];
  contentData: any;
  selectedOption = null;
  executed = false;
  dropdownQueryForm: FormGroup;
  hasFiredRealTimeProgress = false;
  insertValues: any[] = [];
  insertTableValues: any[] = [];
  loadedTables: any[] = [];
  valuesToInsertArray = [];
  isEdit = false;
  isDropEdit = false;
  activeTab = 0;
  telltext = 'Click on the Run button to create the table.';
  buttonText = 'View Table Level Constraint';
  insertButtonText = 'First entry';
  createQuery = '';
  counter = 0;
  hideOnLoad: boolean;
  hideButton = false;
  hideOnlyTable = false;
  errorMessage = '';
  originalQuery = '';
  validUserQuery = true;
  showTelltext = true;
  originalInsertValues: any;
  realTimeProgressTimer: any;
  realTimeProgressRequest: IUserRealTimeProgressUpdateRequest = {
    content_type: 'Resource',
    current: [],
    max_size: 0,
    mime_type: MIME_TYPE.rdbms,
    user_id_type: 'uuid'
  };

  options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showPrintMargin: false,
    indentedSoftWrap: false,
    wrap: true
  };

  constructor(private formBuilder: FormBuilder,
    // tslint:disable-next-line:align
    private configSvc: ConfigService,
    // tslint:disable-next-line:align
    private userSvc: UserService,
    // tslint:disable-next-line:align
    private snackBar: MatSnackBar,
    // tslint:disable-next-line:align
    private dbmsSvc: RdbmsHandsonService) { }

  ngOnInit() {
    this.queryForm = this.formBuilder.group({
      userQueryFormControl: ['', Validators.required]
    });
    this.dropdownQueryForm = this.formBuilder.group({
    });
    this.contentData = this.resourceContent.rdbms;
    this.initializeDb(false);
    if (this.contentData.createInsert.insert.dropdown) {
      this.dropdownData = this.contentData.createInsert.insert.dropdownData;
      this.insertTableValues = Object.keys(this.dropdownData[0].query[0]);
      this.hideOnLoad = true;
      this.hideOnlyTable = true;
    } else {
      this.valuesToInsertArray = [this.contentData.createInsert.insert.insertValues[0]];
      this.insertValues = Object.keys(this.contentData.createInsert.insert.insertValues[0].data);
      this.originalInsertValues = Object.values(this.contentData.createInsert.insert.insertValues[0].data).toString();
      this.hideOnLoad = this.contentData.createInsert.insert.insertValues.length > 1 ? true : false;
      this.hideOnlyTable = this.contentData.createInsert.insert.insertValues.length > 1 ? true : false;
    }
    this.createQuery = this.contentData.createInsert.create.query[0];
    this.originalQuery = this.contentData.createInsert.create.query[0];
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
      }, (err) => {
        this.snackBar.open(this.dbRefreshFailed.nativeElement.value);
      });
  }

  onSelectionChange(index) {
    this.selectedOption = this.dropdownData[index];
    this.originalInsertValues = Object.values(this.selectedOption.query[0]).toString();
    this.executedResult = null;
    this.telltext = 'Click on the Run button to insert record into the table.';
    this.hideOnLoad = false;
    this.hideOnlyTable = false;
  }

  tabClick(event) {
    this.executedResult = null;
    if (event.index === 1) {
      this.telltext = this.contentData.createInsert.insert.telltext;
    } else if (event.index === 2) {
      this.telltext = this.contentData.createInsert.drop.telltext;
    } else {
      this.telltext = 'Click on the Run button to create the table.';
    }
  }

  multipleInsertEntries() {
    this.hideOnLoad = false;
    this.hideOnlyTable = false;
    this.valuesToInsertArray = [this.contentData.createInsert.insert.insertValues[this.counter]];
    this.originalInsertValues = Object.values(this.valuesToInsertArray[0].data).toString();
    this.executedResult = null;
    this.telltext = 'Click on the Run button to insert record into the table.';
  }

  retry(retryQuery) {
    this.activeTab = 0;
    this.counter = 0;
    this.hideOnLoad = true;
    this.hideOnlyTable = false;
    this.telltext = '';
    this.insertButtonText = 'First entry';
    this.dbmsSvc.runQuery(retryQuery).subscribe();
  }

  viewOtherConstraint() {
    if (this.buttonText === 'View Column Level Constraint') {
      this.createQuery = this.contentData.createInsert.create.query[0];
      this.originalQuery = this.contentData.createInsert.create.query[0];
      this.buttonText = 'View Table Level Constraint';
    } else {
      this.buttonText = 'View Column Level Constraint';
      this.createQuery = this.contentData.createInsert.create.query[1];
      this.originalQuery = this.contentData.createInsert.create.query[1];
    }
  }

  run(type: string) {
    this.executedResult = null;
    this.errorMessage = '';
    let query = '';
    this.executed = true;
    if (type === 'create') {
      query = this.createQuery;
    } else if (type === 'insert') {
      if (!this.contentData.createInsert.insert.dropdown) {
        if (this.contentData.createInsert.insert.insertValues.length > 1) {
          this.counter += 1;
          query = this.contentData.createInsert.insert.query[0] + '(' +
            Object.values(this.valuesToInsertArray[0].data).toString().split(',').map(v => !v ? '\'\'' : v) + ')';
          this.showTelltext = this.originalInsertValues === Object.values(this.valuesToInsertArray[0].data).toString() ? true : false;
        } else {
          query = this.contentData.createInsert.insert.query[0] + '(' +
            Object.values(this.contentData.createInsert.insert.insertValues[0].data).toString().split(',').map(v => !v ? '\'\'' : v) + ')';
          this.showTelltext = this.originalInsertValues === Object.values
            (this.contentData.createInsert.insert.insertValues[0].data).toString() ? true : false;
        }
      } else {
        const queryToBeReplaced = this.contentData.createInsert.insert.query[0];
        const tempArray = Object.values(this.selectedOption.query[0]);
        const insertQuery = this.contentData.createInsert.insert.default && !tempArray[2] ?
          queryToBeReplaced.replace(',DOJ', '') : queryToBeReplaced;
        const replaceValue = this.contentData.createInsert.insert.default && tempArray[2] === '' ?
          // tslint:disable-next-line:max-line-length
          (tempArray[0] + ',' + tempArray[1]).split(',').map(v => !v ? '\'\'' : v) : tempArray.toString().split(',').map(v => !v ? '\'\'' : v);
        query = insertQuery + '(' + replaceValue + ')';
        this.showTelltext = this.originalInsertValues === tempArray.toString() ? true : false;
      }
    } else {
      query = this.contentData.createInsert.drop.query[0];
      if (query) {
        this.dbmsSvc.runQuery(query).subscribe(res => {
          this.executedResult = res;
          this.executed = false;
        },
          (err) => {
            this.errorMessage = 'Some error occurred. Please try again later!';
            this.executed = false;
          });
      }
      return;
    }
    if (query) {
      this.dbmsSvc.compositeQuery(query, type).subscribe(res => {
        this.executedResult = res;
        this.executed = false;
        if (!this.contentData.createInsert.insert.dropdown) {
          if (this.contentData.createInsert.insert.insertValues.length > 1) {
            this.hideOnLoad = true;
            this.hideButton = this.counter >= 3 ? true : false;
            this.hideOnlyTable = this.counter >= 3 ? false : true;
            this.insertButtonText = this.counter === 1 ? 'Second entry' : this.counter >= 2 ? 'Third entry' : 'First entry';
            // tslint:disable-next-line:max-line-length
            this.telltext = this.valuesToInsertArray[0].telltext ? this.valuesToInsertArray[0].telltext : 'Click on the Entry button to see the records to be inserted.';
          } else {
            this.hideOnLoad = false;
            this.hideOnlyTable = false;
          }
        } else {
          this.telltext = type === 'insert' ? this.selectedOption.telltext : '';
        }
        if (type === 'create') {
          this.dbmsSvc.compareQuery(this.originalQuery, query).subscribe(response => {
            this.validUserQuery = response.validationStatus;
          });
          this.telltext = res.validationStatus ? this.contentData.createInsert.create.telltext : '';
        }
      },
        (err) => {
          this.errorMessage = 'Some error occurred. Please try again later!';
          this.executed = false;
        });
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
