/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';

import 'brace';
import 'brace/ext/language_tools';

import 'brace/mode/sql';
import 'brace/snippets/sql';
import { RdbmsHandsonService } from '../../services/rdbms-handson.service';
import { IRdbmsApiResponse } from '../../model/rdbms-handson.model';
import { IProcessedViewerContent } from '../../../../services/viewer.service';

@Component({
  selector: 'app-dbms-playground',
  templateUrl: './dbms-playground.component.html',
  styleUrls: ['./dbms-playground.component.scss']
})
export class DbmsPlaygroundComponent implements OnInit {

  @Input() resourceContent: IProcessedViewerContent;
  options: any = {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    showPrintMargin: false,
    indentedSoftWrap: false,
    wrap: true
  };
  userQuery = '';
  executedResult: IRdbmsApiResponse;
  executed = false;
  errorMessage = '';
  loading = true;
  constructor(private dbmsSvc: RdbmsHandsonService) { }

  ngOnInit() {
    this.dbmsSvc.initializeDatabase(this.resourceContent.content.identifier).subscribe();
  }

  run() {
    this.executed = true;
    this.dbmsSvc.playground(this.userQuery).subscribe(res => {
      this.executedResult = res[0];
      this.executed = false;
    },
      (err) => {
        this.errorMessage = 'Some error occurred. Please try again later!';
        this.executed = false;
      });
  }

}
