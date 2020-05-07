/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs/internal/observable/interval';
import { map } from 'rxjs/internal/operators/map';
import { Subscription } from 'rxjs/internal/Subscription';
import { IProcessedViewerContent } from '../../../../services/viewer.service';
import { IDndQuiz, IDndSnippet } from '../../models/dnd-quiz.model';
import { DndQuizService } from '../../services/dnd-quiz.service';
import { DndSnippetComponent } from '../dnd-snippet/dnd-snippet.component';

@Component({
  selector: 'app-dnd-quiz',
  templateUrl: './dnd-quiz.component.html',
  styleUrls: ['./dnd-quiz.component.scss']
})
export class DndQuizComponent implements OnInit {
  processedContent: IProcessedViewerContent;
  collectionId: string;
  @Input() scrollableRef: ElementRef<HTMLDivElement>;

  quizData: IDndQuiz;
  answerList: IDndSnippet[] = [];
  timeLeft: number;
  startTime: number;
  timerSubscription: Subscription;
  quizStatus: 'inprogress' | 'evaluating' | 'submitted' = 'inprogress';
  result: boolean;
  scrollable: ElementRef<any> = undefined;

  constructor(private dndQuizSvc: DndQuizService, private route: ActivatedRoute) {}
  paramSubscription;
  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(data => {
      this.processedContent = data.playerDetails.processedResource;
      this.collectionId = data.playerDetails.toc.identifier;
    });
    this.dndQuizSvc.getDndQuizData(this.processedContent.content.artifactUrl).subscribe((data: IDndQuiz) => {
      this.quizData = data;
      this.startQuiz();
    });
  }

  drop(event: CdkDragDrop<DndSnippetComponent[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  startQuiz() {
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
  }

  submitQuiz() {
    this.quizStatus = 'evaluating';
    this.timerSubscription.unsubscribe();

    this.result = this.dndQuizSvc.submit(this.quizData, this.answerList);

    this.quizStatus = 'submitted';
  }

  reset() {
    this.timerSubscription.unsubscribe();

    this.quizData.optionsList = new Array<IDndSnippet>();

    this.quizData.dndQuestions.options.answerOptions.forEach(option => this.quizData.optionsList.push(option));
    this.quizData.dndQuestions.options.additionalOptions.forEach(option => this.quizData.optionsList.push(option));

    this.dndQuizSvc.randomize(this.quizData.optionsList);
    this.answerList = new Array<IDndSnippet>();
    this.startQuiz();
  }
}
