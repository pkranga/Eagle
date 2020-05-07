/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ValuesService } from '../../../../services/values.service';

@Component({
  selector: 'ws-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss']
})
export class ParserComponent implements OnInit {
  slideIndex = [1, 1];
  browserName = '';
  constructor(private http: HttpClient, private valueSvc: ValuesService) {
    this.browserName = this.valueSvc.getBrowserInfo().name.toLowerCase();
  }
  @Input() config;
  ngOnInit() {}
}
