/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { Observable, throwError, noop } from 'rxjs';
import { tap, mergeMap } from 'rxjs/operators';

import { MatDialog, MatSnackBar } from '@angular/material';

import { IContent, ITrainingOffering } from '../../../../models/content.model';
import { NominateDialogComponent } from '../nominate-dialog/nominate-dialog.component';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';
import { TrainingsService } from '../../../../services/trainings.service';
import { addMonths } from 'date-fns';
import { TrainingShareDialogComponent } from '../training-share-dialog/training-share-dialog.component';
import { ILHResponse, IJITForm, ITrainingFilterForm } from '../../../../models/training.model';
import { TrainingFilterDialogComponent } from '../training-filter-dialog/training-filter-dialog.component';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
  @Input() content: IContent;
  @ViewChild('registrationSuccessful', { static: true }) registrationSuccessful: TemplateRef<any>;
  @ViewChild('registrationUnsuccessful', { static: true }) registrationUnsuccessful: TemplateRef<any>;
  @ViewChild('deregistrationSuccessful', { static: true }) deregistrationSuccessful: TemplateRef<any>;
  @ViewChild('deregistrationUnsuccessful', { static: true }) deregistrationUnsuccessful: TemplateRef<any>;
  @ViewChild('trainingsFetchFailed', { static: true }) trainingsFetchFailed: TemplateRef<any>;

  selectedView: 'training' | 'jit' = 'training';
  currentTrainings: ITrainingOffering[];
  currentTab = 0;
  registeredTrainings: ITrainingOffering[] = [];
  currentDate = new Date();
  fromDate = new Date();
  toDate = addMonths(this.fromDate, 6);
  selectedLocation: string;
  isUserJL6OrAbove: boolean;
  trainingLocations$: Observable<any[]>;
  fetchingTrainings: boolean;
  jitForm: IJITForm;

  filterData: ITrainingFilterForm = {
    location: undefined,
    fromDate: new Date(),
    toDate: addMonths(this.fromDate, 6)
  };

  constructor(
    private trainingsApi: TrainingsApiService,
    private trainingsSvc: TrainingsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    if (!this.content.trainings) {
      this.trainingsSvc.getTrainings(this.content).subscribe(trainings => {
        this.content.trainings = trainings;
        this.segregateTrainings();
      });
    } else {
      this.segregateTrainings();
    }

    this.trainingLocations$ = this.trainingsApi.getTrainingLocations();
    this.trainingsSvc.getUserJL6Status().subscribe(result => {
      this.isUserJL6OrAbove = result;
    });
  }

  segregateTrainings() {
    this.currentTrainings = this.content.trainings.filter(training => !training.registered);

    this.registeredTrainings = this.content.trainings.filter(training => training.registered);

    this.currentTab = this.registeredTrainings.length ? 0 : 1;
  }

  applyFilters() {
    this.fetchingTrainings = true;

    this.trainingsSvc
      .getTrainings(this.content, this.filterData.fromDate, this.filterData.toDate, this.filterData.location)
      .subscribe(
        trainings => {
          this.content.trainings = trainings;
          this.segregateTrainings();
        },
        () => {
          this.fetchingTrainings = false;
          this.snackBar.openFromTemplate(this.trainingsFetchFailed);
        },
        () => {
          this.fetchingTrainings = false;
        }
      );
  }

  resetFilters() {
    this.fromDate = this.currentDate;
    this.toDate = addMonths(this.fromDate, 6);
    this.selectedLocation = undefined;

    this.applyFilters();
  }

  onBtnRegisterClick(training: ITrainingOffering) {
    training.submitting = true;
    if (!training.registered) {
      this.trainingsSvc
        .registerForTraining(training)
        .pipe(
          tap(
            () => {
              this.snackBar.openFromTemplate(this.registrationSuccessful);
              training.submitting = false;
            },
            () => {
              this.snackBar.openFromTemplate(this.registrationUnsuccessful);
              training.submitting = false;
            }
          ),
          mergeMap(() =>
            this.trainingsSvc.getTrainings(this.content, this.fromDate, this.toDate, this.selectedLocation)
          )
        )
        .subscribe(trainings => {
          this.content.trainings = trainings;
          this.segregateTrainings();
        });
    } else {
      this.trainingsSvc
        .deregisterFromTraining(training)
        .pipe(
          tap(
            () => {
              this.snackBar.openFromTemplate(this.deregistrationSuccessful);
              training.submitting = false;
            },
            () => {
              this.snackBar.openFromTemplate(this.deregistrationUnsuccessful);
              training.submitting = false;
            }
          ),
          mergeMap(() =>
            this.trainingsSvc.getTrainings(this.content, this.fromDate, this.toDate, this.selectedLocation)
          )
        )
        .subscribe(trainings => {
          this.content.trainings = trainings;
          this.segregateTrainings();
        });
    }
  }

  openShareDialog(offering: ITrainingOffering) {
    this.dialog.open<TrainingShareDialogComponent, ITrainingOffering>(TrainingShareDialogComponent, {
      data: { ...offering }
    });
  }

  openNominateDialog(offering: ITrainingOffering) {
    const dialogRef = this.dialog.open<NominateDialogComponent, ITrainingOffering>(NominateDialogComponent, {
      data: { ...offering }
    });

    dialogRef
      .afterClosed()
      .pipe(
        mergeMap(dialogResult => {
          if (dialogResult) {
            return this.trainingsSvc.getTrainings(this.content, this.fromDate, this.toDate, this.selectedLocation);
          }

          return throwError(dialogResult);
        })
      )
      .subscribe(trainings => {
        this.content.trainings = trainings;
        this.segregateTrainings();
      }, noop);
  }

  openJITForm() {
    this.selectedView = 'jit';
  }

  openTrainings() {
    this.selectedView = 'training';
  }

  openFilterDialog() {
    this.dialog
      .open<TrainingFilterDialogComponent, ITrainingFilterForm, ITrainingFilterForm>(TrainingFilterDialogComponent, {
        data: { ...this.filterData }
      })
      .afterClosed()
      .subscribe(dialogResult => {
        if (dialogResult) {
          this.filterData = dialogResult;
          this.applyFilters();
        }
      });
  }
}
