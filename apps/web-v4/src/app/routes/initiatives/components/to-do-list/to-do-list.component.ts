/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IToDoListResponse, IToDoListRequest } from '../../../../models/wingspan-pages.model';
import { WingspanPagesApiService } from '../../../../apis/wingspan-pages-api.service';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit {
  @Input() config: IToDoListRequest;
  fetchingInProgress = false;
  toDoList: IToDoListResponse[] = [];
  constructor(private wingspanPagesService: WingspanPagesApiService) { }

  ngOnInit() {
    if (this.config && this.config.toDoId) {
      this.fetchToDos(this.config.toDoId);
    }
  }

  fetchToDos(id: string) {
    this.fetchingInProgress = true;
    this.wingspanPagesService.fetchToDos(id).subscribe(
      (data: IToDoListResponse[]) => {
        this.toDoList = data;
      }
    );
    this.fetchingInProgress = false;
  }
}
