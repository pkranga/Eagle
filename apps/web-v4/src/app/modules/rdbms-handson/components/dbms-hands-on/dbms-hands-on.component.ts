/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { RdbmsHandsonService } from '../../services/rdbms-handson.service';
@Component({
  selector: 'app-dbms-hands-on',
  templateUrl: './dbms-hands-on.component.html',
  styleUrls: ['./dbms-hands-on.component.scss']
})
export class DbmsHandsOnComponent implements OnInit {

  @Input()
  processedContent: IProcessedViewerContent;
  @Input() collectionId: string;
  constructor() { }

  ngOnInit() {
  }

}
