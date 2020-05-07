/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pentagon',
  templateUrl: './pentagon.component.html',
  styleUrls: ['./pentagon.component.scss']
})
export class PentagonComponent implements OnInit, OnChanges {
  pentagonTracks: string[] = [
    'Accelerate',
    'Innovate',
    'Insight',
    'Experience',
    'Assure'
  ];
  svgFileName = 'Pentagon';
  @Output()
  trackClicked = new EventEmitter();
  @Input()
  default = '';
  @Input()
  pillar: string;
  constructor() {}

  ngOnInit() {
    if (this.default) {
      this.onTrackClicked(this.pentagonTracks.indexOf(this.default));
    }
  }

  ngOnChanges() {
    this.svgFileName = 'Pentagon';
    if (this.pillar) {
      const idx = this.pentagonTracks.indexOf(this.pillar);
      if (idx > -1) {
        this.svgFileName = 'Pentagon_' + this.pentagonTracks[idx];
      }
    }
  }

  onTrackClicked(idx) {
    this.svgFileName = 'Pentagon_' + this.pentagonTracks[idx];
    // console.log('Pentagon pillar', this.pentagonTracks[idx])
    setTimeout(() => {
      this.trackClicked.emit(this.pentagonTracks[idx]);
    }, 0);
    // this.pentagonTracks = this.rotate(this.pentagonTracks, idx)
  }
}
