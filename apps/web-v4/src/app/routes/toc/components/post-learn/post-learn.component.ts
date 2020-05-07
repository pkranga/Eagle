/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { IContent, IValidResource } from '../../../../models/content.model';
import { FetchStatus } from '../../../../models/status.model';
import { ContentService } from '../../../../services/content.service';

@Component({
  selector: 'app-post-learn',
  templateUrl: './post-learn.component.html',
  styleUrls: ['./post-learn.component.scss']
})
export class PostLearnComponent implements OnInit {
  @Input() content: IContent;
  // validResource: IValidResource;
  postLearnFetchStatus: FetchStatus;
  postLearnContents: IContent[] = [];
  constructor(private contentSvc: ContentService) {}

  ngOnInit() {
    // this.checkIfResourceExists(this.content);
    // this.postLearnFetchStatus = 'done';
    this.fetchPostLearnContents();
  }

  private fetchPostLearnContents() {
    this.postLearnFetchStatus = 'fetching';
    this.contentSvc.fetchPostLearnContents(this.content.identifier).subscribe(
      data => {
        if (data.length) {
          this.postLearnContents = data;
          this.postLearnFetchStatus = 'done';
        } else {
          this.postLearnFetchStatus = 'none';
        }
      },
      err => {
        this.postLearnFetchStatus = 'none';
      }
    );
  }

  // private checkIfResourceExists(content: IContent) {
  //   let preContentIdsArray: string[] = [];
  //   let postContentIdsArray: string[] = [];
  //   if (content.preContents && content.preContents.length) {
  //     preContentIdsArray = content.preContents.map(v => v.identifier);
  //   }
  //   if (content.postContents && content.postContents.length) {
  //     postContentIdsArray = content.postContents.map(v => v.identifier);
  //   }
  //   const concatenatedIdsArray = preContentIdsArray.concat(postContentIdsArray);
  //   const request = {
  //     Ids: concatenatedIdsArray.filter((item, pos) => {
  //       return concatenatedIdsArray.indexOf(item) === pos;
  //     })
  //   };
  //   if (request.Ids.length) {
  //     this.postLearnFetchStatus = 'fetching';
  //     this.contentSvc.validResourceCheck(request).subscribe(
  //       (result: IValidResource) => {
  //         this.postLearnFetchStatus = 'done';
  //         this.validResource = result;
  //       },
  //       err => {
  //         this.postLearnFetchStatus = 'done';
  //       }
  //     );
  //   }
  // }
}
