/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
@ Component({
  selector: 'app-my-collaborators',
  templateUrl: './my-collaborators.component.html',
  styleUrls: ['./my-collaborators.component.scss']
})
export class MyCollaboratorsComponent implements OnInit {
  @ Input() loader2: boolean;
  @ Input() nsoData;
  @ Input() userprogressData;
  sharedGoal: any;
  artifactsShared: any;
  serachCount;
  likes;
  catelogueCount;

  goal_count;
  playList_count;
  playListData;
  goalData;
  myProgress;
  assessment_complete;
  goalSharedData;
  goals_shared_to_me_count;
  goalsSharedToMe;
  content_created;
  playgroundData;
  expertsContacted;
  expertContactedData;
  artifactSharedData;
  public progressData: Array< any> = [];
  filtersub = 'Learning Path';
  filterMain = 0;
  collection = 'collection';
  color = 'primary';
  mode = 'determinate';
  size = 'small';
  getUserlearning = false;
  loginas: any;
  playlistSharedToMe: any;
  playlistSharedByMe: any;

  constructor() {}

  ngOnInit() {
    this .chartData();
    // this.goalSharedData.map((cur: any) => {
    //   cur.progress1 = 0;
    //   cur.progress1 = Math.ceil(cur.progress);
    //   if ( cur.shared_on === 'None') {
    //     cur.shared_on = 'None';
    //   } else {
    //     cur.shared_on = this.datePipe.transform(new Date(cur.shared_on), 'MMM d, y');
    //   }
    // });

    // this.goalsSharedToMe.map((cur: any) => {
    //   cur.progress1 = 0;
    //   cur.progress1 = Math.ceil(cur.progress);
    //   if ( cur.shared_on === 'None') {
    //     cur.shared_on = 'None';
    //   } else {
    //     cur.shared_on = this.datePipe.transform(new Date(cur.shared_on), 'MMM d, y');
    //   }
    // });

    this .artifactSharedData.map((cur: any) => {
      if (cur.date_of_use === 'None') {
        cur.date_of_use = 'None';
      } else {
        cur.date_of_use = new Date(cur.date_of_use);
      }
    });

    // this.expertContactedData.map((cur: any) => {
    //   if ( cur.date_of_use === 'None') {
    //     cur.date_of_use = 'None';
    //   } else {
    //     cur.date_of_use = this.datePipe.transform(new Date(cur.date_of_use), 'MMM d, y');
    //   }
    // });

    // this.playlistSharedByMe.map((cur: any) => {
    //   if ( cur.shared_on === 'None') {
    //     cur.shared_on = 'None';
    //   } else {
    //     cur.shared_on = this.datePipe.transform(new Date(cur.shared_on), 'MMM d, y');
    //   }
    // });

    // this.playlistSharedToMe.map((cur: any) => {
    //   if ( cur.shared_on === 'None') {
    //     cur.shared_on = 'None';
    //   } else {
    //     cur.shared_on = this.datePipe.transform(new Date(cur.shared_on), 'MMM d, y');
    //   }
    // });

    // this.playgroundData.map((cur: any) => {
    //   if ( cur.date_of_activity === 'None') {
    //     cur.date_of_activity = 'None';
    //   } else {
    //     cur.date_of_activity = this.datePipe.transform(new Date(cur.date_of_activity), 'MMM d, y');
    //   }
    // });
  }
  chartData() {
    // userprogress data
    this .sharedGoal = this .userprogressData.shared_goal_content;
    this .goal_count = this .userprogressData.goal_progress.length;
    this .playList_count = this .userprogressData.playlist_progress.length;
    this .playListData = this .userprogressData.playlist_progress;
    this .goalData = this .userprogressData.goal_progress;
    this .myProgress = this .userprogressData.learning_history;
    this .assessment_complete =
      this .myProgress.length - this .assessment_complete;
    // this.goalSharedData=this. userprogressData['goal_shared_by_me'];
    this .goals_shared_to_me_count = this .userprogressData.goal_shared_to_me_count;
    this .goalsSharedToMe = this .userprogressData.goal_shared_to_me;
    this .playlistSharedByMe = this .userprogressData.playlist_shared_by_me;
    this .playlistSharedToMe = this .userprogressData.playlist_shared_to_me;

    // nsoData
    this .content_created = this .nsoData.content_created;
    this .playgroundData = this .nsoData.playground_details;
    this .artifactsShared = this .nsoData.artifacts_shared.length;
    this .expertsContacted = this .nsoData.experts_contacted.length;
    this .expertContactedData = this .nsoData.experts_contacted;
    this .artifactSharedData = this .nsoData.artifacts_shared;
    this .goalSharedData = this .userprogressData.goal_shared_by_me;
    this .serachCount = this .nsoData.search_count;
    this .likes = this .nsoData.like;
    this .catelogueCount = this .nsoData.catalogSearch_count;
  }
}
