/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { RoutingService } from '../../../../services/routing.service';

@Component({
  selector: 'app-modalpopup',
  templateUrl: './modalpopup.component.html',
  styleUrls: ['./modalpopup.component.scss']
})
export class ModalpopupComponent implements OnInit {
  @Input() show: boolean;
  @Input() modelType: string;
  @Input() btnType: string;
  @Input() title: string;
  @Input() body: string;
  @Input() okText: string;
  @Input() cancelText: string;
  @Input() okFunction: any;
  @Input() caclFunction: any;
  public addClass = true;
  constructor(public routingSvc: RoutingService) {}

  ngOnInit() {}

  getHeadClass() {
    let returnValue = 'primary';
    switch (this.modelType) {
      case 'primary':
        returnValue = 'bg-theme';
        break;
      case 'warning':
        returnValue = 'bg-warning';
        break;
      case 'danger':
        returnValue = 'bg-danger';
        break;
      case 'success':
        returnValue = 'bg-success';
        break;
      case 'info':
        returnValue = 'bg-info';
        break;
      default:
        returnValue = 'bg-theme';
    }
    return returnValue;
  }
  getBtnClass() {
    let returnValue = 'primary';
    switch (this.btnType) {
      case 'primary':
        returnValue = 'theme';
        break;
      case 'warning':
        returnValue = 'warning';
        break;
      case 'danger':
        returnValue = 'danger';
        break;
      case 'success':
        returnValue = 'success';
        break;
      case 'info':
        returnValue = 'info';
        break;
      default:
        returnValue = 'theme';
    }
    return returnValue;
  }

  cancelFunction() {
    this.addClass = false;
    setTimeout(() => {
      this.show = false;
    }, 1200);
  }
}
