/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { IPostTag } from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';
import { SocialService } from '../../../../services/social.service';
import { MatAutocompleteSelectedEvent, MatAutocomplete, MatSnackBar } from '@angular/material';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
import { KhubService } from '../../../../services/khub.service';
import { ITopicTaggerAction, ITopicTaggerResponse } from '../../../../models/khub.model';

@Component({
  selector: 'app-topic-tagger',
  templateUrl: './topic-tagger.component.html',
  styleUrls: ['./topic-tagger.component.scss']
})
export class TopicTaggerComponent implements OnInit {
  @Input() itemType: string;
  @Input() topics: string[];
  @Input() showLimit: number;
  @Input() itemId: string;
  missingTopic: string;
  sliceValue: number;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  selectedTags: IPostTag[] = [];
  autocompleteAllTags: IPostTag[];
  fetchTagsStatus: FetchStatus;
  addTopic: ITopicTaggerAction = {
    item: this.itemId,
    topic: '',
    user: this.authSvc.userId,
    action: 'add'
  };
  deleteTopic: ITopicTaggerAction = {
    item: this.itemId,
    topic: '',
    user: this.authSvc.userId,
    action: 'delete'
  };
  respo: ITopicTaggerResponse;
  @ViewChild('tagsInput', { static: false }) tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  constructor(private socialSvc: SocialService, public matSnackBar: MatSnackBar, private authSvc: AuthService, private khubServ: KhubService) {
    this.tagsCtrl.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe((value: string) => {
        if (value && value.length) {
          this.autocompleteAllTags = [];
          this.fetchTagsStatus = 'fetching';
          this.socialSvc.fetchAutoComplete(value).subscribe(
            tags => {
              this.autocompleteAllTags = tags || [];
              if (tags.length === 0) {
                this.addTopic.topic = value;
              }
              this.fetchTagsStatus = 'done';
            },
            err => {
              this.fetchTagsStatus = 'error';
            }
          );
        }
      });
  }
  ngOnInit() {
    if (this.itemType === '' || this.itemType === undefined) {
      this.itemType = 'Project';
    }
    this.sliceValue = this.showLimit ? this.showLimit : 3;
  }
  showAll() {
    try {
      this.sliceValue = this.topics.length;
    } catch (e) {
      console.error(e);
    }
  }
  removeTag(tag: IPostTag): void {
    const index = this.selectedTags.findIndex(pTag => pTag.id === tag.id);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selectTag(event: MatAutocompleteSelectedEvent, duplicateMsg: string, invalidMsg: string): void {
    // if (
    //   !this.selectedTags
    //     .map(tag => tag.name)
    //     .includes((event.option.viewValue || '').trim())
    // ) {
    //   if (
    //     this.autocompleteAllTags
    //       .map(tag => tag.name)
    //       .includes(event.option.viewValue)
    //   ) {
    this.selectedTags.push(event.option.value);
    this.addTopic.topic = event.option.value.name;
    //   } else {
    //     this.openSnackBar(invalidMsg);
    //   }
    // } else {
    //   this.openSnackBar(duplicateMsg);
    // }
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }
  openSnackBar(message: string) {
    this.matSnackBar.open(message);
  }

  addOrDeleteTopic(type: string, topic: string) {
    try {
      if (type === 'add') {
        this.addTopic.item = this.itemId;
        this.khubServ.postTopicTaggerAction(this.addTopic).subscribe(
          data => {
            this.respo = data;
            this.openSnackBar('topic submitted for approval');
            this.selectedTags = [];
          },
          err => {
            this.openSnackBar('Some error occured try  later');
          }
        );
      } else if (type === 'delete') {
        this.deleteTopic.topic = topic;
        this.deleteTopic.item = this.itemId;
        this.khubServ.postTopicTaggerAction(this.deleteTopic).subscribe(
          data => {
            this.respo = data;
            this.openSnackBar('Removal of topic submitted for approval');
          },
          err => {
            this.openSnackBar('Some error occured try  later');
          }
        );
      }
    } catch (e) {
      console.error(e);
    }
  }
}
