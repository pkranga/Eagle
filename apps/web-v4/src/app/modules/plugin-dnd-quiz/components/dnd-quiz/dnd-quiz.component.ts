/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Host, ElementRef, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { DndQuizService } from '../../services/dnd-quiz.service';
import { IDndQuiz, IDndSnippet } from '../../models/dnd-quiz.model';
import { DndSnippetComponent } from '../dnd-snippet/dnd-snippet.component';
import { interval } from 'rxjs/internal/observable/interval';
import { Subscription } from 'rxjs/internal/Subscription';
import { map } from 'rxjs/internal/operators/map';
import { ViewerComponent } from '../../../../routes/viewer/components/viewer/viewer.component';
import { IUserRealTimeProgressUpdateRequest } from '../../../../models/user.model';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { ConfigService } from '../../../../services/config.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-dnd-quiz',
  templateUrl: './dnd-quiz.component.html',
  styleUrls: ['./dnd-quiz.component.scss']
})
export class DndQuizComponent implements OnInit, OnDestroy {
  @Input() processedContent: IProcessedViewerContent;
  @Input() collectionId: string;
  @Input() scrollable: ElementRef<any>;

  quizData: IDndQuiz;
  answerList: IDndSnippet[] = [];
  timeLeft: number;
  startTime: number;
  timerSubscription: Subscription;
  quizStatus: 'inprogress' | 'evaluating' | 'submitted' = 'inprogress';
  result: boolean;
  hasFiredRealTimeProgress = false;
  realTimeProgressTimer: any;
  realTimeProgressRequest: IUserRealTimeProgressUpdateRequest = {
    content_type: 'Resource',
    current: ['0'],
    max_size: 0,
    mime_type: MIME_TYPE.dragDrop,
    user_id_type: 'uuid'
  };

  constructor(private configSvc: ConfigService, private dndQuizSvc: DndQuizService, private userSvc: UserService) {}

  ngOnInit() {
    this.dndQuizSvc.getDndQuizData(this.processedContent.content.artifactUrl).subscribe(
      (data: IDndQuiz) => {
        this.quizData = data;
        this.startQuiz();
      },
      () => {
        this.quizData = null;
        this.startQuiz();
      }
    );
  }

  ngOnDestroy() {
    if (!this.hasFiredRealTimeProgress && this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
      this._fireRealTimeProgress();
      if (this.realTimeProgressTimer) {
        clearTimeout(this.realTimeProgressTimer);
      }
    }
  }

  drop(event: CdkDragDrop<DndSnippetComponent[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  startQuiz() {
    try {
      this.quizStatus = 'inprogress';
      this.timeLeft = this.quizData.timeLimit;
      this.startTime = Date.now();
      this.timerSubscription = interval(100)
        .pipe(map(() => this.startTime + this.quizData.timeLimit - Date.now()))
        .subscribe(() => {
          this.timeLeft -= 0.1;
          if (this.timeLeft < 0) {
            this.timeLeft = 0;
            this.timerSubscription.unsubscribe();
            this.submitQuiz();
          }
        });
      if (this.configSvc.instanceConfig.platform.updateRealTimeProgress) {
        this.raiseRealTimeProgress();
      }
    } catch (e) {
      return;
    }
  }

  submitQuiz() {
    try {
      this.quizStatus = 'evaluating';
      this.timerSubscription.unsubscribe();

      this.result = this.dndQuizSvc.submit(this.quizData, this.answerList);

      this.quizStatus = 'submitted';
    } catch (e) {
      return;
    }
  }

  reset() {
    try {
      this.timerSubscription.unsubscribe();

      this.quizData.optionsList = new Array<IDndSnippet>();

      this.quizData.dndQuestions.options.answerOptions.forEach(option => this.quizData.optionsList.push(option));
      this.quizData.dndQuestions.options.additionalOptions.forEach(option => this.quizData.optionsList.push(option));

      this.dndQuizSvc.randomize(this.quizData.optionsList);
      this.answerList = new Array<IDndSnippet>();
      this.startQuiz();
    } catch (e) {
      return;
    }
  }

  private raiseRealTimeProgress() {
    this.realTimeProgressRequest = {
      ...this.realTimeProgressRequest,
      current: ['1'],
      max_size: 1
    };
    if (this.realTimeProgressTimer) {
      clearTimeout(this.realTimeProgressTimer);
    }
    this.hasFiredRealTimeProgress = false;
    this.realTimeProgressTimer = setTimeout(() => {
      this.hasFiredRealTimeProgress = true;
      this._fireRealTimeProgress();
    }, 2 * 60 * 1000);
  }
  private _fireRealTimeProgress() {
    this.realTimeProgressRequest.content_type = this.processedContent.content.contentType;
    this.userSvc
      .realTimeProgressUpdate(this.processedContent.content.identifier, this.realTimeProgressRequest)
      .subscribe();
  }
}
