/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { IQuiz, IQuizSubmitRequest } from '../model/quiz.model';
import { TelemetryService } from '../../../services/telemetry.service';
import { ICommEvent, IQuizTelemetry, COMM_STATES } from '../../../models/comm-events.model';
import { AuthService } from '../../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  constructor(private telemetrySvc: TelemetryService, private authSvc: AuthService) {}

  createAssessmentSubmitRequest(
    identifier: string,
    title: string,
    quiz: IQuiz,
    questionAnswerHash: { [questionId: string]: any[] }
  ): IQuizSubmitRequest {
    const quizWithAnswers = {
      ...quiz,
      identifier,
      title,
      userEmail: this.authSvc.userEmail
    };
    quizWithAnswers.questions.map(question => {
      if (
        question.questionType === undefined ||
        question.questionType === 'mcq-mca' ||
        question.questionType === 'mcq-sca'
      ) {
        return question.options.map(option => {
          if (questionAnswerHash[question.questionId]) {
            option.userSelected = questionAnswerHash[question.questionId].includes(option.optionId);
          } else {
            option.userSelected = false;
          }
          return option;
        });
      } else if (question.questionType === 'fitb') {
        for (let i = 0; i < question.options.length; i++) {
          if (questionAnswerHash[question.questionId]) {
            question.options[i].response = questionAnswerHash[question.questionId][0].split(',')[i];
          }
        }
      } else if (question.questionType === 'mtf') {
        for (let i = 0; i < question.options.length; i++) {
          if (questionAnswerHash[question.questionId] && questionAnswerHash[question.questionId][0][i]) {
            // for(let option of questionAnswerHash[question.questionId][0]) {

            // }
            for (let j = 0; j < questionAnswerHash[question.questionId][0].length; j++) {
              if (question.options[i].text === questionAnswerHash[question.questionId][0][j].source.innerText) {
                question.options[i].response = questionAnswerHash[question.questionId][0][j].target.innerText;
              }
            }
          } else {
            question.options[i].response = '';
          }
        }
      }
    });
    return quizWithAnswers;
  }

  firePlayerTelemetryEvent(
    contentId: string,
    courseId: string,
    mimeType: string,
    result: any,
    isCompleted: boolean,
    state: COMM_STATES,
    isIdeal: boolean,
    force: boolean = false
  ) {
    const event: ICommEvent<IQuizTelemetry> = {
      app: 'WEB_PLAYER_PLUGIN',
      plugin: 'quiz',
      type: 'TELEMETRY',
      state,
      data: {
        identifier: contentId,
        courseId,
        mimeType,
        isCompleted,
        force,
        isIdeal,
        details: result
      }
    };
    this.telemetrySvc.playerTelemetryEvent(event);
  }
}
