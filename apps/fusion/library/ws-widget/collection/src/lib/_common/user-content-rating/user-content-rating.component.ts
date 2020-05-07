/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { WidgetContentService } from '../../_services/widget-content.service'
import { EventService } from '@ws-widget/utils'

@Component({
  selector: 'ws-widget-user-content-rating',
  templateUrl: './user-content-rating.component.html',
  styleUrls: ['./user-content-rating.component.scss'],
})
export class UserContentRatingComponent implements OnInit {

  @Input() contentId!: string
  @Input() isDisabled = false
  isRequesting = true
  userRating = 0
  constructor(
    private events: EventService,
    private contentSvc: WidgetContentService,
  ) { }

  ngOnInit() {
    this.contentSvc.fetchContentRating(this.contentId)
      .subscribe(
        result => {
          this.isRequesting = false
          this.userRating = result.rating
        },
        _err => {
          this.isRequesting = false
        },
      )
  }

  addRating(index: number) {
    this.isRequesting = true
    const previousRating = this.userRating
    if (this.userRating !== index + 1) {
      this.userRating = index + 1
      this.events.raiseInteractTelemetry(
        'rating',
        'content',
        { contentId: this.contentId, rating: this.userRating },
      )
      this.contentSvc.addContentRating(this.contentId, { rating: this.userRating }).subscribe(
        _ => {
          this.isRequesting = false
        },
        _ => {
          this.isRequesting = false
          this.userRating = previousRating
        },
      )
    } else {
      this.contentSvc.deleteContentRating(this.contentId).subscribe(
        _ => {
          this.userRating = 0
          this.isRequesting = false
        },
        _ => {
          this.isRequesting = false
          this.userRating = previousRating
        },
      )
    }
  }

}
