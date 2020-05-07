/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  constructor() {}
  @Input() data;

  currentIndex = 0;

  ngOnInit() {}

  slide(dir: 'left' | 'right') {
    if (dir === 'left') {
      if (this.currentIndex === 0) {
        this.currentIndex = this.data.slides.length - 1;
      } else {
        this.currentIndex -= 1;
      }
    } else if (dir === 'right') {
      if (this.currentIndex === this.data.slides.length - 1) {
        this.currentIndex = 0;
      } else {
        this.currentIndex += 1;
      }
    }
  }

  slideTo(index: number) {
    if (index >= 0 && index < this.data.slides.length) {
      this.currentIndex = index;
    } else {
      this.currentIndex = 0;
    }
  }
}
