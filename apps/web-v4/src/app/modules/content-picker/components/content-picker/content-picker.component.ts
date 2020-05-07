/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContentService } from '../../../../services/content.service';
import { IContent } from '../../../../models/content.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ISearchRequest } from '../../../../models/searchResponse.model';

@Component({
  selector: 'app-content-picker',
  templateUrl: './content-picker.component.html',
  styleUrls: ['./content-picker.component.scss']
})
export class ContentPickerComponent implements OnInit {
  TABS = ['Program', 'Course', 'Learning Module', 'Resource'];
  TAB_CONTENT_TYPE_MAPPING = {
    Program: 'Learning Path',
    Course: 'Course',
    'Learning Module': 'Collection',
    Resource: 'Resource'
  };

  showTabs = false;

  @Input()
  placeholder: string;

  @Input()
  disableSearchInput: boolean;

  @Input()
  checkedContent: { [identifier: string]: boolean } = {};
  @Input()
  ignoreContent: string[] = [];
  @Output()
  selectedContentChanged = new EventEmitter<IContent[]>();

  searchedQuery: string;
  searchContentData: { [contentType: string]: IContent[] } = {};
  searchRequest: { [contentType: string]: ISearchRequest } = {};
  fetchInProgress: { [contentType: string]: boolean } = {};
  fetchMetaInProgress: boolean;
  contentMeta: { [identifier: string]: IContent } = {};

  currentTab: string;
  searchHits = 0;
  searchFormGroup: FormGroup;

  constructor(private contentSvc: ContentService, private _formBuilder: FormBuilder) {}

  ngOnInit() {
    this.searchFormGroup = this._formBuilder.group({
      searchInputCtrl: [{ value: '', disabled: this.disableSearchInput }]
    });

    if (Object.keys(this.checkedContent).length) {
      this.fetchMetaInProgress = true;
      this.contentSvc.fetchMultipleContent(Object.keys(this.checkedContent)).subscribe(data => {
        this.fetchMetaInProgress = false;
        data = data.filter(item => Boolean(item));
        if (data && data.length > 0) {
          data.forEach(item => {
            this.contentMeta[item.identifier] = item;
          });
          this.contentChanged();
        }
      });
    }
  }

  searchContent(tab, resetData: boolean, loadMore = false) {
    this.currentTab = tab || this.TABS[0];
    this.searchedQuery = this.searchFormGroup.get('searchInputCtrl').value;
    this.showTabs = true;
    if (resetData) {
      this.searchContentData = {};
    }
    if (resetData || !this.searchContentData[this.currentTab] || !this.searchContentData[this.currentTab].length) {
      this.searchRequest[this.currentTab] = {
        pageNo: 0,
        pageSize: 10,
        query: this.searchFormGroup.get('searchInputCtrl').value,
        filters: {
          contentType: [this.TAB_CONTENT_TYPE_MAPPING[this.currentTab]]
        }
      };
    } else if (!loadMore && this.searchContentData[this.currentTab].length) {
      return;
    }
    this.fetchInProgress[this.currentTab] = true;
    this.contentSvc.search(this.searchRequest[this.currentTab]).subscribe(data => {
      this.searchHits = data.totalHits;
      this.fetchInProgress[this.currentTab] = false;
      this.searchContentData[this.currentTab] = this.searchContentData[this.currentTab] || [];
      this.searchContentData[this.currentTab] = [
        ...this.searchContentData[this.currentTab],
        ...data.result.filter(content => !this.ignoreContent.includes(content.identifier))
      ];
      this.searchRequest[this.currentTab].pageNo += 1;
      data.result.forEach(item => (this.contentMeta[item.identifier] = item));
    });
  }

  contentRemoved(key) {
    this.checkedContent[key] = false;
    this.contentChanged();
  }
  contentChanged() {
    this.selectedContentChanged.emit(
      Object.keys(this.checkedContent)
        .filter(content => this.checkedContent[content])
        .map(identifier => this.contentMeta[identifier])
    );
  }
}
