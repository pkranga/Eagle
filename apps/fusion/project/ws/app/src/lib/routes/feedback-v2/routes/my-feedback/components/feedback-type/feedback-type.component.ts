/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { EFeedbackType } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-feedback-type',
  templateUrl: './feedback-type.component.html',
  styleUrls: ['./feedback-type.component.scss'],
})
export class FeedbackTypeComponent implements OnInit {
  @Input() feedbackType!: EFeedbackType
  feedbackTypes: typeof EFeedbackType

  constructor() {
    this.feedbackTypes = EFeedbackType
  }

  ngOnInit() {}
}
