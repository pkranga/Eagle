/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { NSQuiz } from '../../quiz.model'

@Component({
  selector: 'viewer-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  @Input() learningObjective = ''
  @Input() complexityLevel = ''
  @Input() duration = 0
  @Input() timeLimit = 0
  @Input() noOfQuestions = 0
  @Output() userSelection = new EventEmitter<NSQuiz.TUserSelectionType>()

  constructor() { }

  ngOnInit() {
  }

  overviewed(event: NSQuiz.TUserSelectionType) {
    this.userSelection.emit(event)
  }
}
