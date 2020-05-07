/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IContent } from '../../../../models/content.model';
import { IQuiz, userSelectionType } from '../../model/quiz.model';
import { ValuesService } from '../../../../services/values.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  // isSmall = false;
  @Input()
  quizMeta: IContent;

  @Input()
  quiz: IQuiz;

  @Output() userSelection = new EventEmitter<userSelectionType>();

  constructor() {
    // this.valuesSvc.isXSmall$.subscribe((isXSmall) => {
    //   if (isXSmall) {
    //     this.isSmall = true;
    //   } else {
    //     this.isSmall = false;
    //   }
    // });
  }

  ngOnInit() {}

  overviewed(event: userSelectionType) {
    this.userSelection.emit(event);
  }
}
