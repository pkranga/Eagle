/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Inject } from '@angular/core'
import { MAT_SNACK_BAR_DATA } from '@angular/material'
import { IFeedbackSnackbarData } from '../../models/feedback.model'

@Component({
  selector: 'ws-widget-feedback-snackbar',
  templateUrl: './feedback-snackbar.component.html',
  styleUrls: ['./feedback-snackbar.component.scss'],
})
export class FeedbackSnackbarComponent implements OnInit {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public snackbarData: IFeedbackSnackbarData) {}

  ngOnInit() {}
}
