/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnChanges } from '@angular/core'
import { ContentProgressService } from './content-progress.service'

@Component({
  selector: 'ws-widget-content-progress',
  templateUrl: './content-progress.component.html',
  styleUrls: ['./content-progress.component.scss'],
})
export class ContentProgressComponent implements OnChanges {

  @Input()
  contentId = ''

  @Input()
  progress = 0

  constructor(
    private progressSvc: ContentProgressService,
  ) { }

  ngOnChanges() {
    if (this.contentId && !this.progress) {
      this.progressSvc.getProgressFor(this.contentId).subscribe(data => {
        this.progress = data
        if (this.progress) {
          this.progress = Math.round(this.progress * 10000) / 100
        }
      })
    }
  }

}
