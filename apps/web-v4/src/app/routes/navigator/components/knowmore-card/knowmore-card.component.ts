/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { THUMBNAIL_BASE_PATH } from '../../constants/path.constant';

@Component({
  selector: 'app-knowmore-card',
  templateUrl: './knowmore-card.component.html',
  styleUrls: ['./knowmore-card.component.scss']
})
export class KnowmoreCardComponent implements OnInit, OnChanges {
  @Input()
  id: string;
  @Input()
  title: string;
  @Input()
  buttonLabel = 'KNOW MORE';
  @Input()
  thumbnail = 'card_img.jpg';
  @Input()
  absoluteThumbnail = '';
  @Input()
  numAlternateCertificates = 0;
  @Input()
  isDisabled = false;
  @Input()
  description: string;
  @Output()
  knowMoreClicked = new EventEmitter();
  @Output()
  cardEvent = new EventEmitter<any>();

  @Input()
  isCardSelected = false;

  thumbnailPath: string;

  @Input()
  showSpinner = false;

  THUMBNAIL_BASE_PATH = THUMBNAIL_BASE_PATH;
  constructor() {}

  ngOnInit() {}
  ngOnChanges() {
    this.getThumbnail();
    if (!this.description) {
      this.description = 'No description available.';
    }
  }

  getThumbnail() {
    this.thumbnailPath = this.absoluteThumbnail || this.THUMBNAIL_BASE_PATH + this.thumbnail;
  }

  viewAllClicked(id: string) {
    this.isCardSelected = true;
    this.cardEvent.emit({
      type: 'VIEW_ALL_ALTERNATIVES',
      certificateId: id
    });
  }

  updateUrl(event: any) {
    this.thumbnailPath = THUMBNAIL_BASE_PATH + 'card_img.jpg';
  }
}
