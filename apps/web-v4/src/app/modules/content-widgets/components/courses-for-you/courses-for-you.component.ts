/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { BatchService } from '../../../../apis/batch-api.service';

@Component({
  selector: 'app-courses-for-you',
  templateUrl: './courses-for-you.component.html',
  styleUrls: ['./courses-for-you.component.scss']
})
export class CoursesForYouComponent implements OnInit {
  @Input() cardType: 'basic' | 'advanced' = 'advanced';
  genericCourses: IContent[];
  streamCourses: IContent[];
  constructor(private batchService: BatchService) { }

  ngOnInit() {
    this.fetchGenericContent();
    this.fetchStreamContent();
  }

  fetchGenericContent() {
    this.batchService.fetchGenericContent().subscribe(data => {
      if (data && data.length) {
        this.genericCourses = data || [];
      }
    });
  }

  fetchStreamContent() {
    this.batchService.fetchStreamContent().subscribe(data => {
      if (data && data.length) {
        this.streamCourses = data || [];
      }
    });
  }
}
