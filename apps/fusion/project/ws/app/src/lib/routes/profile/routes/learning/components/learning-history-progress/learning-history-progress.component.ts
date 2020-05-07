/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input } from '@angular/core'
import { NSLearningHistory } from '../../models/learning.models'
import { LearningHistoryService } from '../../services/learning-history.service'

@Component({
  selector: 'ws-app-learning-history-progress',
  templateUrl: './learning-history-progress.component.html',
  styleUrls: ['./learning-history-progress.component.scss'],
})
export class LearningHistoryProgressComponent {
  @Input() item: any
  @Input() isParent?: boolean
  children: NSLearningHistory.ILearningHistory | null = null
  loadingChildren = false
  loadedChildren = false
  displayChildren = false

  constructor(private learnHstSvc: LearningHistoryService) {}

  toggleChildren() {
    if (!this.loadedChildren) {
      this.getChildProgress()
    } else {
      this.displayChildren = !this.displayChildren
    }
  }

  getChildProgress() {
    this.loadingChildren = true
    this.learnHstSvc.fetchChildProgress(this.item.children).subscribe(result => {
      this.children = result
      this.loadingChildren = false
      this.loadedChildren = true
      this.displayChildren = true
    })
  }
}
