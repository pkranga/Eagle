/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { LearningHistoryApiService } from '../../../../apis/learning-history-api.service';
import { ILearningHistory } from '../../../../models/learning-history.model';
import { ValuesService } from '../../../../services/values.service';
@Component({
  selector: 'app-learning-history-progress',
  templateUrl: './learning-history-progress.component.html',
  styleUrls: ['./learning-history-progress.component.scss']
})
export class LearningHistoryProgressComponent implements OnInit {
  @Input() item: any;
  @Input() isParent?: boolean;
  children: ILearningHistory;
  loadingChildren = false;
  loadedChildren = false;
  displayChildren = false;

  selectedTheme = '';
  constructor(private lhService: LearningHistoryApiService, private valuesSvc: ValuesService) {}

  ngOnInit() {
    this.valuesSvc.theme$.subscribe(themeName => {
      this.selectedTheme = themeName.name;
    });
  }

  toggleChildren() {
    if (!this.loadedChildren) {
      this.getChildProgress();
    } else {
      this.displayChildren = !this.displayChildren;
    }
  }

  getChildProgress() {
    this.loadingChildren = true;
    this.lhService.fetchChildProgress(this.item.children).subscribe(result => {
      this.children = result;
      this.loadingChildren = false;
      this.loadedChildren = true;
      this.displayChildren = true;
    });
  }
}
