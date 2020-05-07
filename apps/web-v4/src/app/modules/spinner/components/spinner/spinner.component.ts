/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  @Input()
  spinMode: 'determinate' | 'indeterminate' = 'indeterminate';
  @Input()
  spinSize: 'small' | 'medium' | 'large' | 'xlarge' = 'medium';
  @Input()
  spinWidth: 'thin' | 'medium' | 'thick' = 'medium';
  @Input()
  spinColor: 'primary' | 'accent' = 'accent';
  @Input()
  spinValue: number;

  spinSizeHash = {
    small: 40,
    medium: 60,
    large: 75,
    xlarge: 90
  };
  spinWidthHash = {
    thin: 3,
    medium: 5,
    thick: 8
  };
  constructor() {}
}
