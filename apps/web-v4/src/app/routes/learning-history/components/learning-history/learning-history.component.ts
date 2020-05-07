/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit } from '@angular/core';

import { LearningHistoryApiService } from '../../../../apis/learning-history-api.service';
import { ILearningHistory, ILearningHistoryItem } from '../../../../models/learning-history.model';
import { RoutingService } from '../../../../services/routing.service';
import { ICertification } from '../../../../models/certification.model';
import { CertificationService } from '../../../../services/certification.service';
import { IContent } from '../../../../models/content.model';

interface ILearningHistoryContent {
  content: ILearningHistory;
  contentType: string;
  pageNum: number;
  loading: boolean;
  isLoadingFirstTime: boolean;
  fetchStatus: 'fetching' | 'done' | 'error';
}

@Component({
  selector: 'app-learning-history',
  templateUrl: './learning-history.component.html',
  styleUrls: ['./learning-history.component.scss']
})
export class LearningHistoryComponent implements OnInit {
  lhContent: ILearningHistoryContent[] = [];
  selectedStatusType: 'inprogress' | 'completed' = 'inprogress';
  selectedTabIndex = 0;
  contentTypes = ['learning path', 'course', 'collection', 'resource', 'certification'];
  pageSize = 10;
  loadingContent = true;
  ongoingCertifications: ILearningHistoryItem[] = [];
  passedCertifications: ILearningHistoryItem[] = [];

  constructor(
    private lhSvc: LearningHistoryApiService,
    private certificationSvc: CertificationService,
    public routingSvc: RoutingService
  ) {}

  ngOnInit() {
    this.contentTypes.forEach(contentType => {
      this.lhContent.push({
        content: {
          count: 0,
          results: []
        },
        contentType,
        pageNum: 0,
        loading: false,
        isLoadingFirstTime: true,
        fetchStatus: 'fetching'
      });
    });

    this.getUserProgress(this.lhContent[this.selectedTabIndex]);
  }

  getUserProgress(content: ILearningHistoryContent) {
    this.toggleLoading(true, content);

    if (content.contentType !== 'certification') {
      this.lhSvc
        .fetchContentProgress(content.pageNum, this.pageSize, this.selectedStatusType, content.contentType)
        .subscribe((data: ILearningHistory) => {
          content.content.count = data.count;

          data.results.forEach(result => {
            content.content.results.push(result);
          });

          content.pageNum++;
          this.toggleLoading(false, content);
        });
    } else {
      if (this.ongoingCertifications.length && this.passedCertifications.length) {
        content.content.results =
          this.selectedStatusType === 'inprogress' ? this.ongoingCertifications : this.passedCertifications;
        this.toggleLoading(false, content);
        return;
      }

      this.certificationSvc.fetchCertifications().subscribe(
        (data: ICertification) => {
          // Create the list for ongoing certifications
          this.ongoingCertifications = data.ongoingList.map((cert: IContent) => this.contentToLearningHistory(cert));
          // Create the list for passed certifications
          this.passedCertifications = data.passedList.map((cert: IContent) => this.contentToLearningHistory(cert));
          content.content.results =
            this.selectedStatusType === 'inprogress' ? this.ongoingCertifications : this.passedCertifications;
          this.toggleLoading(false, content);
        },
        err => {
          this.toggleLoading(false, content);
        }
      );
    }
  }

  reinitializeHistory() {
    this.lhContent.forEach(content => {
      content.content.count = 0;
      content.content.results = [];
      content.pageNum = 0;
      content.loading = false;
      content.isLoadingFirstTime = true;
      content.fetchStatus = 'fetching';
    });
  }

  onStatusChange() {
    this.selectedStatusType = this.selectedStatusType === 'inprogress' ? 'completed' : 'inprogress';
    this.reinitializeHistory();
    this.getUserProgress(this.lhContent[this.selectedTabIndex]);
  }

  onTabChange(selectedIndex: number) {
    this.selectedTabIndex = selectedIndex;
    if (this.lhContent[selectedIndex].fetchStatus === 'done') {
      return;
    }
    this.getUserProgress(this.lhContent[this.selectedTabIndex]);
  }

  contentToLearningHistory(cert: IContent) {
    return {
      identifier: cert.identifier,
      name: cert.name,
      contentType: cert.contentType,
      progress: undefined,
      totalDuration: cert.duration,
      children: cert.children.map(child => child.identifier)
    };
  }

  toggleLoading(loading: boolean, content: ILearningHistoryContent) {
    if (loading) {
      this.loadingContent = true;
      content.loading = true;
    } else {
      content.loading = false;
      content.isLoadingFirstTime = false;
      content.fetchStatus = 'done';

      this.loadingContent = false;
    }
  }
}
