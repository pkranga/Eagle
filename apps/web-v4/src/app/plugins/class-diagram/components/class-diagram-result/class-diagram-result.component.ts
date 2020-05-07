/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-class-diagram-result',
  templateUrl: './class-diagram-result.component.html',
  styleUrls: ['./class-diagram-result.component.scss']
})
export class ClassDiagramResultComponent implements OnInit {

  @Input() result: any;
  @Input() userData: any;
  displayClassColumns: string[] = ['classname', 'access', 'attributes', 'methods', 'error'];
  displayRelationColumns: string[] = ['relationship', 'result', 'error'];
  constructor() { }

  ngOnInit() {
  }
}
