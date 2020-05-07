/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IContent } from '../../../../models/content.model';
import { GoalsService } from '../../../../services/goals.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { IPredefinedGoal, IUserGoalRemoveSubsetRequest } from '../../../../models/goal.model';
import { MatStepper, MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { ValuesService } from '../../../../services/values.service';
import { FetchStatus } from '../../../../models/status.model';
import { MultilineSnackbarComponent } from '../multiline-snackbar/multiline-snackbar.component';

type TGoalStepperMode = 'create' | 'edit';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.scss']
})
export class AddGoalComponent implements OnInit, OnChanges {
  @ViewChild('stepper', { static: false }) stepper: MatStepper;
  @ViewChild('createFailed', { static: true }) createFailed: ElementRef<any>;
  @ViewChild('createGoalSuccess', { static: true }) createGoalSuccess: ElementRef<any>;
  @ViewChild('updateFailed', { static: true }) updateFailed: ElementRef<any>;
  @ViewChild('updateGoalSuccess', { static: true }) updateGoalSuccess: ElementRef<any>;

  @Input()
  predefinedGoal: IPredefinedGoal;

  @Input()
  existingGoal: any;

  @Input()
  goalId = '';

  @Input()
  goalTitle = '';

  @Input()
  goalDescription = '';

  @Input()
  userGivenGoalDuration = 1;

  @Input()
  disableGoalMeta: boolean;

  @Input()
  disableGoalContent: boolean;

  @Input()
  checkedContent: { [identifier: string]: boolean } = {};

  @Input()
  checkedContentMetas: IContent[] = [];

  @Input()
  mode: TGoalStepperMode = 'create';

  @Output()
  goalCreated = new EventEmitter();

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  dummyFormGroup: FormGroup;
  goalDuration: number;
  selectedGoalType: string;
  goalCreationInProgress: boolean;
  removeSubsetInProgress: FetchStatus;
  isSmallScreen: boolean;
  suggestedDuration: any;
  snackBarLines: string[];

  constructor(
    private formBuilder: FormBuilder,
    private goalsSvc: GoalsService,
    private telemetrySvc: TelemetryService,
    private valuesSvc: ValuesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.valuesSvc.isXSmall$.subscribe(data => {
      this.isSmallScreen = data;
    });
    this.initializeForm();
  }

  ngOnChanges() {
    if (this.predefinedGoal) {
      this.calculateGoalDuration();
    }
  }

  initializeForm() {
    this.firstFormGroup = this.formBuilder.group({
      goalTitleCtrl: [
        { value: this.goalTitle, disabled: this.disableGoalMeta },
        [Validators.required, Validators.minLength(10), Validators.maxLength(100)]
      ],
      goalDescriptionCtrl: [{ value: this.goalDescription, disabled: this.disableGoalMeta }]
    });

    this.dummyFormGroup = this.formBuilder.group({
      dummyFormCtrl: ['', Validators.required]
    });

    let defaultGoalType;
    if (this.predefinedGoal && this.predefinedGoal.user_added > 0) {
      defaultGoalType = this.disableGoalContent ? 'commonshared' : 'tobeshared';
    } else {
      defaultGoalType = this.disableGoalContent ? 'common' : 'user';
    }

    this.secondFormGroup = this.formBuilder.group({
      goalDurationCtrl: [this.userGivenGoalDuration, [Validators.required, Validators.min(1)]],
      goalTypeCtrl: [
        {
          value: defaultGoalType,
          disabled: this.predefinedGoal && (this.predefinedGoal.user_added || this.predefinedGoal.share_added)
        }
      ]
    });
  }

  calculateGoalDuration() {
    const request: IUserGoalRemoveSubsetRequest = {} as IUserGoalRemoveSubsetRequest;
    if (this.predefinedGoal) {
      request.goal_content_id = this.predefinedGoal.goal_content_id;
    } else {
      request.goal_content_id = Object.keys(this.checkedContent).filter(item => this.checkedContent[item]);
    }
    this.removeSubsetInProgress = 'fetching';
    this.goalsSvc.removeSubset(request).subscribe(
      (response: any) => {
        this.removeSubsetInProgress = 'done';
        this.suggestedDuration = response.suggested_time / 60 / 60;
        this.checkedContent = {};
        this.snackBarLines = response.goal_message;
        if (this.snackBarLines && this.snackBarLines.length) {
          this.snackBar.openFromComponent(MultilineSnackbarComponent, {
            data: this.snackBarLines
          });
          this.snackBarLines = [];
        }
        response.resource_list.forEach(element => {
          this.checkedContent[element] = true;
          this.checkedContentMetas = this.checkedContentMetas.filter(item => this.checkedContent[item.identifier]);
        });
      },
      error => {
        this.removeSubsetInProgress = 'error';
      }
    );
  }

  shouldAllowDurationStep(): boolean {
    return this.checkedContent && Object.keys(this.checkedContent).filter(idx => this.checkedContent[idx]).length > 0;
  }

  createGoal(stepper) {
    this.goalCreationInProgress = true;
    const req = {
      goal_content_id: Object.keys(this.checkedContent).filter(idx => this.checkedContent[idx]),
      goal_title: this.firstFormGroup.get('goalTitleCtrl').value,
      goal_desc: this.firstFormGroup.get('goalDescriptionCtrl').value,
      goal_duration: this.secondFormGroup.get('goalDurationCtrl').value,
      goal_type: this.existingGoal ? this.existingGoal.goal_type : this.secondFormGroup.get('goalTypeCtrl').value,
      goal_id: undefined
    };

    if (this.predefinedGoal) {
      req.goal_id = this.predefinedGoal.id;
    }

    if (this.goalId) {
      req.goal_id = this.goalId;
    }
    this.goalsSvc.createGoal(req).subscribe(
      response => {
        this.telemetrySvc.goalTelemetryEvent(
          this.mode === 'create' ? 'added' : 'updated',
          response.response[0].goal_id,
          Object.keys(this.checkedContent),
          undefined
        );
        this.goalCreationInProgress = false;
        if (stepper) {
          stepper.reset();
        }
        this.firstFormGroup.reset();
        this.secondFormGroup.reset();
        this.initializeForm();
        this.checkedContent = {};
        this.checkedContentMetas = [];
        this.goalCreated.emit();
        this.snackBar.open(this.mode === 'create' ? this.createGoalSuccess.nativeElement.value : this.updateGoalSuccess.nativeElement.value);
      },
      error => {
        this.goalCreationInProgress = false;
        this.snackBar.open(this.mode === 'create' ? this.createFailed.nativeElement.value : this.updateFailed.nativeElement.value);
      }
    );
  }

  updateCommonGoalDuration() {
    this.goalCreationInProgress = true;
    this.goalsSvc
      .updateCommonGoalDuration(
        {
          request: {
            goal_duration: this.secondFormGroup.get('goalDurationCtrl').value,
            goal_type: this.existingGoal ? this.existingGoal.goal_type : 'common'
          }
        },
        this.goalId
      )
      .subscribe(
        response => {
          this.goalCreationInProgress = false;
          this.snackBar.open(this.updateGoalSuccess.nativeElement.value);
        },
        err => {
          this.goalCreationInProgress = false;
          this.snackBar.open(this.updateFailed.nativeElement.value);
        }
      );
  }

  contentChanged(metas) {
    this.checkedContentMetas = metas;
    this.calculateGoalDuration();
    this.dummyFormGroup.patchValue({
      dummyFormCtrl: this.checkedContentMetas.length ? 'dummy' : null
    });
  }
}
