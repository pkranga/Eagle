/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
// tslint:disable-next-line:max-line-length
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, HostListener, ViewChildren, ElementRef, OnChanges } from '@angular/core';
import { quizViewMode, IQuestion } from '../../model/quiz.model';
import { DomSanitizer } from '@angular/platform-browser';
import { jsPlumb } from 'jsplumb';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit, AfterViewInit {
  @ViewChildren('crazy') crazy;
  title = 'match';
  jsPlumbInstance;
  @Input()
  questionNumber: number;
  @Input()
  total: number;
  @Input()
  viewState: quizViewMode;
  @Input()
  question: IQuestion;
  @Input()
  itemSelectedList: string[];
  @Input()
  markedQuestions: Set<string>;
  @Output()
  itemSelected = new EventEmitter<string>();
  @Input()
  quizAnswerHash: any;
  temp;
  safeQuestion;
  correctOption: boolean[] = [];
  unTouchedBlank: boolean[] = [];
  matchHintDisplay = [];
  constructor(private domSanitizer: DomSanitizer, private elementRef: ElementRef) {}

  ngOnInit() {
    if (this.question.questionType === 'fitb') {
      const iterationNumber = (this.question.question.match(/<input/g) || []).length;
      for (let i = 0; i < iterationNumber; i++) {
        this.question.question = this.question.question.replace('<input', 'idMarkerForReplacement');
        this.correctOption.push(false);
        this.unTouchedBlank.push(true);
      }
      for (let i = 0; i < iterationNumber; i++) {
        // tslint:disable-next-line:max-line-length
        this.question.question = this.question.question.replace(
          'idMarkerForReplacement',
          '<input matInput style="border-style: none none solid none; border-width: 1px; padding: 8px 12px;" type="text" id="' +
            this.question.questionId +
            i +
            '"'
        );
      }
      this.safeQuestion = this.domSanitizer.bypassSecurityTrustHtml(this.question.question);
    }
    if (this.question.questionType === 'mtf') {
      this.question.options.map(option => (option.matchForView = option.match));
      const array = this.question.options.map(elem => elem.match);
      const arr = this.shuffle(array);
      for (let i = 0; i < this.question.options.length; i++) {
        this.question.options[i].matchForView = arr[i];
      }
      // console.log(this.question)
      const matchHintDisplayLocal = [...this.question.options];
      for (let i = 0; i < matchHintDisplayLocal.length; i++) {
        if (matchHintDisplayLocal[i].hint) {
          this.matchHintDisplay.push(matchHintDisplayLocal[i]);
        }
      }
      // console.log(this.matchHintDisplay);
    }
  }

  ngAfterViewInit() {
    // alert(this.question.questionType)
    if (this.question.questionType === 'mtf') {
      const _this = this;
      this.jsPlumbInstance = jsPlumb.getInstance({
        // drag options
        DragOptions: {
          cursor: 'pointer'
          // zIndex: 2000
        },
        // default to a gradient stroke from blue to green.
        PaintStyle: {
          stroke: 'rgba(0,0,0,0.5)',
          strokeWidth: 3
        }
        // Container: document.getElementById(this.question.questionId)
      });
      const connectorType = ['Bezier', { curviness: 10 }];
      // var connectorType = ["Straight"];
      // bind to a connection event, just for the purposes of pointing out that it can be done.
      this.jsPlumbInstance.bind('connection', function(i, c) {
        // _this.setBorderColor(i.connection, 'red');
        // console.log(_this.jsPlumbInstance.getAllConnections())
        _this.itemSelected.emit(_this.jsPlumbInstance.getAllConnections());
      });
      this.jsPlumbInstance.bind('connectionDetached', function(i, c) {
        _this.setBorderColor(i.connection, '');
        _this.resetColor();
      });
      this.jsPlumbInstance.bind('connectionMoved', function(i, c) {
        _this.setBorderColorById(i.originalSourceId, '');
        _this.setBorderColorById(i.newSourceId, '');
        _this.setBorderColorById(i.originalTargetId, '');
        _this.resetColor();
      });
      // get the list of ".smallWindow" elements.
      const questionSelector = '.question' + this.question.questionId;
      const answerSelector = '.answer' + this.question.questionId;
      // console.log(questionSelector);
      // console.log(answerSelector);
      const questions = this.jsPlumbInstance.getSelector(questionSelector);
      const answers = this.jsPlumbInstance.getSelector(answerSelector);
      // console.log(questions);
      // console.log(answers);
      this.jsPlumbInstance.batch(function() {
        _this.jsPlumbInstance.makeSource(questions, {
          maxConnections: 1,
          connector: connectorType,
          overlay: 'Arrow',
          endpoint: [
            'Dot',
            {
              radius: 3
            }
          ],
          // anchor:sourceAnchors
          anchor: 'Right'
        });
        _this.jsPlumbInstance.makeTarget(answers, {
          maxConnections: 1,
          dropOptions: {
            hoverClass: 'hover'
          },
          anchor: 'Left',
          endpoint: [
            'Dot',
            {
              radius: 3
            }
          ]
        });
        // console.log(_this.jsPlumbInstance);
      });
    } else if (this.question.questionType === 'fitb') {
      for (let i = 0; i < (this.question.question.match(/<input/g) || []).length; i++) {
        this.elementRef.nativeElement
          .querySelector('#' + this.question.questionId + i)
          .addEventListener('change', this.onChange.bind(this, this.question.questionId + i));
      }
    }
  }

  // ngOnChanges() {
  //   if (this.viewState === 'answer') {
  //     this.matchShowAnswer();
  //   }
  // }

  onEntryInBlank(id) {
    // alert("id in target > "+id);
    // const blank: HTMLInputElement = <HTMLInputElement>document.getElementById(id);
    // alert("value in target > "+blank.value)
    // console.log(id)
    // console.log( 'value in target > ' + blank.value);
    const arr = [];
    for (let i = 0; i < (this.question.question.match(/<input/g) || []).length; i++) {
      const blank: HTMLInputElement = this.elementRef.nativeElement.querySelector('#' + this.question.questionId + i);
      arr.push(blank.value.trim());
      // console.log('blank in target > ' + arr);
    }
    this.itemSelected.emit(arr.join());
    this.ifFillInTheBlankCorrect(id);
  }

  isSelected(option) {
    return this.itemSelectedList && this.itemSelectedList.indexOf(option.optionId) !== -1;
  }

  isQuestionMarked() {
    return this.markedQuestions.has(this.question.questionId);
  }

  markQuestion() {
    if (this.markedQuestions.has(this.question.questionId)) {
      this.markedQuestions.delete(this.question.questionId);
    } else {
      this.markedQuestions.add(this.question.questionId);
    }
  }

  onChange(id, event) {
    // alert("event > "+event)
    // alert("id > "+id)
    this.onEntryInBlank(id);
  }

  setBorderColorById(id, color) {
    document.getElementById(id).style.borderColor = color;
  }

  setBorderColor(connection, color) {
    document.getElementById(connection.sourceId).style.borderColor = color;
    document.getElementById(connection.targetId).style.borderColor = color;
  }

  @HostListener('window:resize')
  onResize(event) {
    if (this.question.questionType === 'mtf') {
      // console.log(event);
      this.jsPlumbInstance.repaintEverything();
    }
  }

  funHello() {
    if (this.question.questionType === 'mtf') {
      // console.log(event);
      this.jsPlumbInstance.repaintEverything();
    }
  }

  ifFillInTheBlankCorrect(id) {
    const blankPosition = id.slice(-1);
    const text = this.question.options[blankPosition].text;
    const valueOfBlank = document.getElementById(id) as HTMLInputElement;
    if (text.trim().toLowerCase() === valueOfBlank.value.trim().toLowerCase()) {
      this.correctOption[blankPosition] = true;
    } else {
      this.correctOption[blankPosition] = false;
    }
    if (valueOfBlank.value.length < 1) {
      this.unTouchedBlank[blankPosition] = true;
    } else {
      this.unTouchedBlank[blankPosition] = false;
    }
  }

  shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  reset() {
    if (this.question.questionType === 'fitb') {
      this.resetBlankBorder();
    } else if (this.question.questionType === 'mtf') {
      this.resetColor();
      this.resetMtf();
    }
  }
  resetMtf() {
    if (this.question.questionType === 'mtf') {
      this.jsPlumbInstance.deleteEveryConnection();
    }
  }
  resetColor() {
    const a = this.jsPlumbInstance.getAllConnections();
    a.forEach(element => {
      element.setPaintStyle({
        stroke: 'rgba(0,0,0,0.5)'
      });
      this.setBorderColor(element, '');
    });
  }
  changeColor() {
    const a = this.jsPlumbInstance.getAllConnections();
    if (a.length < this.question.options.length) {
      alert('Please select all answers');
      return;
    }
    a.forEach(element => {
      const b = element.sourceId;
      const c = element.targetId;
      // console.log(this.question.options[<number>b.slice(-1)-1].match.trim())
      // console.log(element.target.innerHTML.trim())
      if (this.question.options[(b.slice(-1) as number) - 1].match.trim() === element.target.innerHTML.trim()) {
        element.setPaintStyle({
          stroke: '#357a38'
        });
        this.setBorderColor(element, '#357a38');
      } else {
        element.setPaintStyle({
          stroke: '#f44336'
        });
        this.setBorderColor(element, '#f44336');
      }
    });
  }
  matchShowAnswer() {
    if (this.question.questionType === 'mtf') {
      this.jsPlumbInstance.deleteEveryConnection();
      for (let i = 1; i <= this.question.options.length; i++) {
        const questionSelector = '#c1' + this.question.questionId + i;
        // console.log(this.jsPlumbInstance.getSelector(questionSelector))
        for (let j = 1; j <= this.question.options.length; j++) {
          const answerSelector = '#c2' + this.question.questionId + j;
          if (this.question.options[i - 1].match.trim() === this.jsPlumbInstance.getSelector(answerSelector)[0].innerText.trim()) {
            // console.log(this.jsPlumbInstance.getSelector(answerSelector))
            this.jsPlumbInstance.connect({
              source: this.jsPlumbInstance.getSelector(questionSelector),
              target: this.jsPlumbInstance.getSelector(answerSelector),
              anchors: ['Right', 'Left'],
              endpoint: [
                'Dot',
                {
                  radius: 5
                }
              ]
            });
          }
        }
      }
      this.changeColor();
    }
  }
  functionChangeBlankBorder() {
    if (this.question.questionType === 'fitb') {
      for (let i = 0; i < (this.question.question.match(/<input/g) || []).length; i++) {
        if (this.correctOption[i] && !this.unTouchedBlank[i]) {
          // this.elementRef.nativeElement.querySelector('#' + this.question.questionId + i)
          //   .style = 'border-style: none none solid none; border-width: 1px; padding: 8px 12px; border-color: #357a38';
          this.elementRef.nativeElement
            .querySelector('#' + this.question.questionId + i)
            .setAttribute('style', 'border-style: none none solid none; border-width: 1px; padding: 8px 12px; border-color: #357a38');
        } else if (!this.correctOption[i] && !this.unTouchedBlank[i]) {
          // this.elementRef.nativeElement.querySelector('#' + this.question.questionId + i)
          //   .style = 'border-style: none none solid none; border-width: 1px; padding: 8px 12px; border-color: #f44336';
          this.elementRef.nativeElement
            .querySelector('#' + this.question.questionId + i)
            .setAttribute('style', 'border-style: none none solid none; border-width: 1px; padding: 8px 12px; border-color: #f44336');
        } else if (this.unTouchedBlank[i]) {
          // this.elementRef.nativeElement.querySelector('#' + this.question.questionId + i)
          //   .style = 'border-style: none none solid none; border-width: 1px; padding: 8px 12px;';
          this.elementRef.nativeElement
            .querySelector('#' + this.question.questionId + i)
            .setAttribute('style', 'border-style: none none solid none; border-width: 1px; padding: 8px 12px;');
        }
      }
    }
  }

  resetBlankBorder() {
    for (let i = 0; i < (this.question.question.match(/<input/g) || []).length; i++) {
      // this.elementRef.nativeElement.querySelector('#' + this.question.questionId + i)
      //   .style = 'border-style: none none solid none; border-width: 1px; padding: 8px 12px;';
      this.elementRef.nativeElement
        .querySelector('#' + this.question.questionId + i)
        .setAttribute('style', 'border-style: none none solid none; border-width: 1px; padding: 8px 12px;');
    }
  }
}
