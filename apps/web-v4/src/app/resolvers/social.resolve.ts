/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
// service imports
import { AuthService } from '../services/auth.service';
import { PlayerDataService } from '../services/player-data.service';
import { SocialService } from '../services/social.service';
// model imports
import { IViewConversationRequestPartial, IViewConversationResult } from '../models/social.model';
export interface ISocialResolve {
  conversation: IViewConversationResult;
  type: string;
  error?: string;
}

@Injectable()
export class SocialResolve implements Resolve<ISocialResolve> {
  postId: string;
  conversation: IViewConversationResult;
  questionData: IViewConversationResult;
  commentData: IViewConversationResult;
  conversationRequestBlog: IViewConversationRequestPartial = {
    postId: undefined,
    userId: this.authSvc.userId,
    answerId: '',
    postKind: [],
    sessionId: Date.now(),
    sortOrder: 'latest-desc',
    pgNo: 0,
    pgSize: 10
  };
  conversationRequest: IViewConversationRequestPartial = {
    postId: this.postId,
    userId: this.authSvc.userId,
    answerId: '',
    postKind: ['Reply'],
    sessionId: Date.now(),
    pgNo: 0,
    pgSize: 5,
    sortOrder: 'latest-desc'
  };
  commentConversationRequest: IViewConversationRequestPartial = {
    postId: this.postId,
    userId: this.authSvc.userId,
    answerId: '',
    postKind: ['Comment'],
    sessionId: Date.now(),
    pgNo: 0,
    pgSize: 5,
    sortOrder: 'latest-desc'
  };
  constructor(
    private playerDataSvc: PlayerDataService,
    private router: Router,
    private authSvc: AuthService,
    private socialSvc: SocialService
  ) {}
  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ISocialResolve> {
    if (
      state.url.slice(state.url.indexOf('/', 1) + 1, state.url.indexOf('/', state.url.indexOf('/', 1) + 1)) ===
      'q-and-a'
    ) {
      const type = 'qAndA';
      this.postId = route.paramMap.get('resourceId');
      this.conversationRequest.postId = this.postId;
      try {
        const conversation: IViewConversationResult = await this.fetchConversationData(true, true);
        this.playerDataSvc.data = { conversation, type };
        return { conversation, type };
      } catch (error) {
        const conversation = null;
        return { conversation, type };
      }
    } else if (
      state.url.slice(state.url.indexOf('/', 1) + 1, state.url.indexOf('/', state.url.indexOf('/', 1) + 1)) === 'blogs'
    ) {
      const type = 'blogs';
      this.conversationRequestBlog.postId = route.paramMap.get('resourceId');
      try {
        const conversation: IViewConversationResult = await this.fetchConversationDataBlog();
        this.conversation = conversation;
        this.playerDataSvc.data = { conversation, type };
        return { conversation, type };
      } catch (error) {
        const conversation = null;
        return { conversation, type, error };
      }
    }
  }

  async fetchConversationDataBlog() {
    const data: IViewConversationResult = await this.socialSvc
      .fetchConversationData(this.conversationRequestBlog)
      .toPromise();
    this.conversationRequestBlog.pgNo += 1;
    if (data && data.mainPost) {
      this.conversation = data;
      if (this.conversation.mainPost.status === 'Draft') {
        this.router.navigate(['blog-post', 'edit', this.conversationRequestBlog.postId]);
      } else if (this.conversation.mainPost.status === 'Inactive') {
        this.router.navigate(['error', 'forbidden']);
      }
      return data;
    }
  }

  async fetchConversationData(forceNew: boolean, fetchComments = false) {
    this.conversationRequest.pgNo = 0;
    this.conversationRequest.sessionId = Date.now();
    const data: IViewConversationResult = await this.socialSvc
      .fetchConversationData(this.conversationRequest)
      .toPromise();
    if (data.mainPost && data.mainPost.id && (!this.questionData || forceNew)) {
      this.questionData = data;
      if (this.questionData.mainPost.status === 'Draft') {
        this.router.navigate(['qna', 'ask', this.postId]);
      } else if (this.questionData.mainPost.status === 'Inactive') {
        this.router.navigate(['error', 'forbidden']);
      }
    } else if ((!data.mainPost || !data.mainPost.id) && this.questionData) {
      this.questionData.replyPost = [];
      this.questionData.replyPost = [...this.questionData.replyPost, ...(data.replyPost || [])];
      this.questionData.postCount = data.postCount || 0;
      this.questionData.newPostCount = data.newPostCount || 0;
    } else if ((!data.mainPost || !data.mainPost.id) && !this.questionData) {
    }
    if (fetchComments) {
      this.fetchQuestionComments();
    }
    return data;
  }

  private async fetchQuestionComments(forceNew = false) {
    if (!this.commentConversationRequest.postId) {
      this.commentConversationRequest.postId = this.postId;
    }
    const data: IViewConversationResult = await this.socialSvc
      .fetchConversationData(this.commentConversationRequest)
      .toPromise();
    if (data && data.replyPost) {
      if (!this.commentData) {
        this.commentData = data;
      } else {
        this.commentData.newPostCount = data.newPostCount;
        this.commentData.postCount = data.postCount;
        this.commentData.replyPost = [...this.commentData.replyPost, ...data.replyPost];
      }
    }
    this.commentConversationRequest.pgNo += 1;
  }
}
