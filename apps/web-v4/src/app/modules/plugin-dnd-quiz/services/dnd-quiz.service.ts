/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IDndQuiz, IDndSnippet } from '../models/dnd-quiz.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DndQuizService {
  constructor(private http: HttpClient) {}

  getDndQuizData(url: string): Observable<IDndQuiz> {
    return this.http.get<IDndQuiz>(url).pipe(
      map((quizData: IDndQuiz) => {
        return this.initQuiz(quizData);
      })
    );
  }

  private initQuiz(quizData: IDndQuiz): IDndQuiz {
    try {
      // Make fragments out of plain HTML strings.
      this.fragmentOptions(quizData.dndQuestions.options.answerOptions);
      this.fragmentOptions(quizData.dndQuestions.options.additionalOptions);

      // Extract all the options (mandatory and optional) and place them in optionData, which will be used to display options.
      quizData.optionsList = new Array<IDndSnippet>();
      quizData.dndQuestions.options.answerOptions.forEach((option: IDndSnippet) => quizData.optionsList.push(option));

      quizData.dndQuestions.options.additionalOptions.forEach((option: IDndSnippet) =>
        quizData.optionsList.push(option)
      );

      // Randomize the options.
      this.randomize(quizData.optionsList);
      return quizData;
    } catch (e) {
      return quizData;
    }
  }

  // Convert the original HTML snippets into fragments so that they can later be converted to material.
  private fragmentOptions(options: IDndSnippet[]) {
    try {
      const regex = new RegExp('<select.*?</select>');
      options.forEach(option => {
        let fragments = [];
        let text = option.text;
        while (regex.exec(text) !== null) {
          text = text.replace(regex, '^&**$*^&*');
        }
        fragments = text.split('^&*');
        option.fragments = fragments;
      });
    } catch (e) {
      return;
    }
  }

  randomize(list: any[]) {
    let len = list.length,
      temp,
      i;

    while (len) {
      i = Math.floor(Math.random() * len--);

      temp = list[len];
      list[len] = list[i];
      list[i] = temp;
    }
  }

  // Prepares the structure of the answer, then calls evaluate() to process the result.
  submit(quizData: IDndQuiz, answerList: IDndSnippet[]): boolean {
    try {
      const answerSet = new Set();
      const additionalSet = new Set();

      quizData.dndQuestions.options.answerOptions.forEach(option => {
        if (!answerSet.has(option.id)) {
          answerSet.add(option.id);
        }
      });

      quizData.dndQuestions.options.additionalOptions.forEach(option => {
        if (!additionalSet.has(option.id)) {
          additionalSet.add(option.id);
        }
      });

      const answer: IDndQuiz = {
        ...quizData,
        dndQuestions: {
          ...quizData.dndQuestions,
          options: {
            answerOptions: answerList.filter(option => answerSet.has(option.id)),
            additionalOptions: answerList.filter(option => additionalSet.has(option.id))
          }
        }
      };

      const result: boolean = this.evaluate(quizData, answer);
      return result;
    } catch (e) {
      return false;
    }
  }

  // Evaluates the result as a boolean value from the original quiz data and the answer structure it receives.
  private evaluate(quizData: IDndQuiz, answer: IDndQuiz): boolean {
    try {
      let result = true;
      let i = 0;

      // The answer should contain no additional options, otherwise it is incorrect.
      if (answer.dndQuestions.options.additionalOptions && answer.dndQuestions.options.additionalOptions.length) {
        result = false;
        return result;
      }

      // If the answer is empty, it is incorrect.
      // If there are fewer answer options in the answer than in the key, the answer is incorrect.
      if (
        (!answer.dndQuestions.options.answerOptions.length && quizData.dndQuestions.options.answerOptions.length) ||
        answer.dndQuestions.options.answerOptions.length !== quizData.dndQuestions.options.answerOptions.length
      ) {
        result = false;
        return result;
      }

      // Evaluate the order of the answer options and their dropdowns.
      answer.dndQuestions.options.answerOptions.forEach(option => {
        // Check for the order of the code magnets.
        const keyOption = quizData.dndQuestions.options.answerOptions[i];

        if (option.id !== keyOption.id) {
          result = false;
          return result;
        }

        // Evaluate the dropdowns in every code magnet.
        if (option.hasDropDown) {
          let j = 0;
          option.ddOptions.forEach(menu => {
            const selectedDDOption = menu.selectedValue;
            const correctDDOption = keyOption.ddOptions[j].ddownOptions.find(ddOption => ddOption.isCorrect);
            ++j;

            if (!(selectedDDOption && correctDDOption) || !(selectedDDOption === correctDDOption.text)) {
              result = false;
              return result;
            }
          });

          if (!result) {
            return;
          }
        }
        ++i;
      });

      return result;
    } catch (e) {
      return false;
    }
  }
}
