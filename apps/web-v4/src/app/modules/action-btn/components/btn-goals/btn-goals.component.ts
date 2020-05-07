/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GoalSelectionComponent } from '../goal-selection/goal-selection.component';
import { UtilityService } from '../../../../services/utility.service';
import { ConfigService } from '../../../../services/config.service';

@Component({
  selector: 'app-btn-goals',
  templateUrl: './btn-goals.component.html',
  styleUrls: ['./btn-goals.component.scss']
})
export class BtnGoalsComponent implements OnInit {
  @Input()
  contentId: string;

  @Input()
  contentName: string;

  @Input()
  contentDuration: number;

  constructor(
    private dialog: MatDialog,
    private utilSvc: UtilityService,
    private configSvc: ConfigService
  ) {}

  ngOnInit() {}
  showGoalSelectionDialog(event: Event) {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    if (!this.configSvc.instanceConfig.features.btnGoals.available) {
      this.utilSvc.featureUnavailable();
      return;
    }
    this.dialog.open<
      GoalSelectionComponent,
      { contentId: string; title: string; contentDuration: number }
    >(GoalSelectionComponent, {
      data: {
        contentId: this.contentId,
        title: this.contentName,
        contentDuration: this.contentDuration
      }
    });
  }
}
