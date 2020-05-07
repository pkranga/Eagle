/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { ContentProgressService } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-progress-radial',
  templateUrl: './progress-radial.component.html',
  styleUrls: ['./progress-radial.component.scss'],
})
export class ProgressRadialComponent implements OnInit, OnChanges {
  @Input() contentId = ''
  @Input() mode?: 'determinate' | 'indeterminate' = 'determinate'
  @Input() progress?: undefined | number = undefined

  constructor(private contentProgressSvc: ContentProgressService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.progress === undefined) {
      this.contentProgressSvc.getProgressFor(this.contentId).subscribe(data => {
        this.progress = data
        if (this.progress === undefined) {
          this.progress = 0
        }
      })
    }
  }
}
