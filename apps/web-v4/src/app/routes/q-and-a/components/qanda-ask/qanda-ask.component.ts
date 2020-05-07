/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  IPostPublishRequestPartial,
  IPostTag,
  IPostUpdateRequestPartial,
  IViewConversationRequestPartial,
  IViewConversationResult
} from '../../../../models/social.model';
import { FetchStatus } from '../../../../models/status.model';
import { AuthService } from '../../../../services/auth.service';
import { RoutingService } from '../../../../services/routing.service';
import { SocialService } from '../../../../services/social.service';
import { ValuesService } from '../../../../services/values.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-qanda-ask',
  templateUrl: './qanda-ask.component.html',
  styleUrls: ['./qanda-ask.component.scss']
})
export class QandaAskComponent implements OnInit {
  isCreatingPost = false;
  postId: string;
  conversation: IViewConversationResult;
  editMode: 'create' | 'update' | 'draft' = 'create';

  title: string;
  abstract: string;
  body: string;
  updatedBody: string;
  actionBtnsEnabled = false;

  postPublishRequest: IPostPublishRequestPartial = {
    postKind: 'Query',
    postCreator: this.authSvc.userId,
    postContent: {
      title: '',
      abstract: '',
      body: ''
    },
    tags: []
  };

  postUpdateRequest: IPostUpdateRequestPartial = {
    editor: this.authSvc.userId,
    meta: {
      abstract: '',
      body: '',
      title: ''
    },
    postKind: 'Query'
  };

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagsCtrl = new FormControl();
  selectedTags: IPostTag[] = [];
  autocompleteAllTags: IPostTag[];
  tagsFromConversation: IPostTag[] = [];
  fetchTagsStatus: FetchStatus;

  isXSmall$: Observable<boolean>;

  @ViewChild('tagsInput', { static: true }) tagsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  constructor(
    private authSvc: AuthService,
    public matSnackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private socialSvc: SocialService,
    private valueSvc: ValuesService,
    private configSvc: ConfigService
  ) {
    this.isXSmall$ = this.valueSvc.isXSmall$;
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
    this.route.paramMap.subscribe(paramMap => {
      const id = paramMap.get('id');
      if (id) {
        this.postId = id;
        this.fetchPost();
      } else {
        this.editMode = 'create';
      }
    });
  }
  fetchPost() {
    const conversationRequest: IViewConversationRequestPartial = {
      postId: this.postId,
      userId: this.authSvc.userId,
      answerId: '',
      postKind: [],
      sessionId: Date.now()
    };
    this.socialSvc.fetchConversationData(conversationRequest).subscribe(data => {
      if (data && data.mainPost) {
        this.conversation = data;
        if (this.conversation.mainPost.postCreator.postCreatorId !== this.authSvc.userId) {
          this.router.navigate(['error', 'forbidden']);
          return;
        }
        if (this.conversation.mainPost.status === 'Draft') {
          this.editMode = 'draft';
        } else {
          this.editMode = 'update';
        }
        this.abstract = this.conversation.mainPost.postContent.abstract;
        this.body = this.conversation.mainPost.postContent.body;
        // this.onTextChange({htmlText: this.body, isValid: this.body.length > });
        this.title = this.conversation.mainPost.postContent.title;
        this.selectedTags = [...this.conversation.mainPost.tags];
        this.tagsFromConversation = [...this.conversation.mainPost.tags];
      }
    });
  }

  publishPost(publishMsg: string, errorMsg: string) {
    this.isCreatingPost = true;
    this.postPublishRequest.postContent = {
      title: this.title,
      abstract: this.abstract,
      body: this.updatedBody
    };
    if (this.editMode === 'draft') {
      this.postPublishRequest.id = this.postId;
      this.postPublishRequest.source = this.conversation.mainPost.source;
      this.postPublishRequest.dateCreated = this.conversation.mainPost.dtCreated;
    } else {
      this.postPublishRequest.source = {
        id: `${this.configSvc.instanceConfig.platform.rootOrg}_${
          this.configSvc.instanceConfig.platform.org
        }_SocialForum`,
        name: 'SocialForum'
      };
    }
    this.postPublishRequest.tags = this.selectedTags;
    this.socialSvc.publishPost(this.postPublishRequest).subscribe(
      data => {
        this.openSnackBar(publishMsg);
        this.isCreatingPost = false;
        if (data && data.id) {
          this.router.navigate(['qna', data.id]);
        } else {
          this.router.navigate(['qna', 'me']);
        }
      },
      err => {
        this.openSnackBar(errorMsg);
        this.isCreatingPost = false;
      }
    );
  }

  saveDraft(successMsg: string, errorMsg: string) {
    const request: IPostPublishRequestPartial = {
      postKind: 'Query',
      postCreator: this.authSvc.userId,
      postContent: {
        title: this.title,
        abstract: this.abstract,
        body: this.updatedBody
      },
      tags: this.selectedTags
    };
    if (this.conversation) {
      request.dateCreated = this.conversation.mainPost.dtCreated;
      request.id = this.postId;
    }
    this.isCreatingPost = true;
    this.socialSvc.draftPost(request).subscribe(
      data => {
        this.openSnackBar(successMsg);
        this.isCreatingPost = false;
        this.router.navigate(['qna', 'me']);
      },
      err => {
        this.openSnackBar(errorMsg);
        this.isCreatingPost = false;
      }
    );
  }

  update(successMsg: string, errorMsg: string) {
    this.isCreatingPost = true;
    this.postUpdateRequest.meta = {
      title: this.title,
      abstract: this.abstract,
      body: this.updatedBody
    };
    this.postUpdateRequest.id = this.postId;
    const removedTags = [];
    const addedTags = [];
    for (let i = 0; i < this.tagsFromConversation.length; i++) {
      if (!this.selectedTags.map(tag => tag.id).includes(this.tagsFromConversation[i].id)) {
        removedTags.push(this.tagsFromConversation[i]);
      }
    }
    for (let i = 0; i < this.selectedTags.length; i++) {
      if (!this.tagsFromConversation.map(tag => tag.id).includes(this.selectedTags[i].id)) {
        addedTags.push(this.selectedTags[i]);
      }
    }
    this.postUpdateRequest.addTags = addedTags;
    this.postUpdateRequest.removeTags = removedTags;
    this.socialSvc.updatePost(this.postUpdateRequest).subscribe(
      data => {
        this.openSnackBar(successMsg);
        this.isCreatingPost = false;
        this.router.navigate(['qna', this.postId]);
      },
      err => {
        this.openSnackBar(errorMsg);
        this.isCreatingPost = false;
      }
    );
  }

  removeTag(tag: IPostTag): void {
    const index = this.selectedTags.findIndex(pTag => pTag.id === tag.id);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selectTag(event: MatAutocompleteSelectedEvent, duplicateMsg: string, invalidMsg: string): void {
    if (!this.selectedTags.map(tag => tag.name).includes((event.option.viewValue || '').trim())) {
      if (this.autocompleteAllTags.map(tag => tag.name).includes(event.option.viewValue)) {
        this.selectedTags.push(event.option.value);
      } else {
        this.openSnackBar(invalidMsg);
      }
    } else {
      this.openSnackBar(duplicateMsg);
    }
    this.tagsInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  onTextChange(eventData: { htmlText: string; isValid: boolean }) {
    this.actionBtnsEnabled = eventData.isValid;
    this.updatedBody = eventData.htmlText;
  }

  openSnackBar(message: string) {
    this.matSnackBar.open(message);
  }
}
