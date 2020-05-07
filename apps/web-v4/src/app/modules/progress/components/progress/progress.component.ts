/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit, OnChanges {
  @Input()
  contentId: string;

  @Input()
  type: 'linear' | 'radial' = 'linear';

  // mode: 'determinate' | 'indeterminate' = 'indeterminate';
  mode = 'determinate';
  progress: undefined | number = undefined;

  constructor(private userSvc: UserService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.contentId) {
      this.userSvc.getProgressFor(this.contentId).subscribe(data => {
        this.progress = data;
        if (this.progress) {
          this.progress = Math.round(this.progress * 10000) / 100;
        }
        // this.mode = 'determinate';
      });
    }
  }
}
