/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  IInteraction,
  IInteractionGroupMeta
} from '../../../../models/interactiveVideo.model';

@Component({
  selector: 'app-interaction-group-manager',
  templateUrl: './interaction-group-manager.component.html',
  styleUrls: ['./interaction-group-manager.component.scss']
})
export class InteractionGroupManagerComponent implements OnInit {
  @Input() interactionGroup: IInteraction[] = [];
  @Input() interactionGroupMeta: IInteractionGroupMeta;

  @Output() interactionGroupEvent = new EventEmitter();

  currentQuestionIndex = 0;
  interactionResponse: { [interactionIndex: number]: number[] } = {};
  constructor() {}

  ngOnInit() {
    if (this.interactionGroup.length) {
      this.interactionGroup.forEach((interaction, i) => {
        this.interactionResponse[i] = [];
      });
    }
  }

  showNextQuestion() {
    if (this.currentQuestionIndex + 1 === this.interactionGroup.length) {
      this.interactionDone();
    } else {
      this.currentQuestionIndex += 1;
    }
  }

  showPrevQuestion() {
    this.currentQuestionIndex -= 1;
  }

  skipAll() {
    this.interactionDone();
  }

  selectOption(optionIndex: number) {
    if (this.interactionGroup[this.currentQuestionIndex].isSubmitted) {
      return;
    }
    if (this.interactionGroup[this.currentQuestionIndex].type === 'SCQ') {
      this.interactionResponse[this.currentQuestionIndex] = [];
      this.interactionResponse[this.currentQuestionIndex].push(optionIndex);
    } else if (
      this.interactionGroup[this.currentQuestionIndex].type === 'MCQ'
    ) {
      const index = this.interactionResponse[this.currentQuestionIndex].indexOf(
        optionIndex
      );
      if (index === -1) {
        this.interactionResponse[this.currentQuestionIndex].push(optionIndex);
      } else {
        this.interactionResponse[this.currentQuestionIndex].splice(index, 1);
      }
    }
    // console.log('this.interactionResponse >', this.interactionResponse);
  }

  checkIfSelected(optionIndex): boolean {
    if (
      this.interactionResponse[this.currentQuestionIndex].indexOf(optionIndex) >
      -1
    ) {
      return true;
    }
    return false;
  }
  checkIfCorrect(optionIndex): boolean {
    const index = this.interactionResponse[this.currentQuestionIndex].indexOf(
      optionIndex
    );
    if (
      this.interactionGroup[this.currentQuestionIndex].options[optionIndex]
        .isCorrect &&
      index > -1
    ) {
      return true;
    }
    return false;
  }

  submitInteraction() {
    this.interactionGroup[this.currentQuestionIndex].isSubmitted = true;
    // console.log(
    //   'this.interactionGroup[this.currentQuestionIndex] >',
    //   this.interactionGroup[this.currentQuestionIndex]
    // );
  }

  interactionDone() {
    this.interactionGroupEvent.emit('resume');
  }
}
