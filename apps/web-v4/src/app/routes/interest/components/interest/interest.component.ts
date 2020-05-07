/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { InterestService } from '../../../../services/interest.service';
import { RoutingService } from '../../../../services/routing.service';
import { ResolveResponse } from '../../../../models/routeResolver.model';
import { TelemetryService } from '../../../../services/telemetry.service';

@Component({
  selector: 'app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.scss']
})
export class InterestComponent implements OnInit {
  @ViewChild('toastSuccess', { static: true }) toastSuccess: ElementRef<any>;
  @ViewChild('toastDuplicate', { static: true }) toastDuplicate: ElementRef<any>;
  @ViewChild('toastFailure', { static: true }) toastFailure: ElementRef<any>;
  @ViewChild('interestSearch', { static: true }) interestSearch: ElementRef<any>;
  userInterestsResponse: ResolveResponse<string[]> = this.route.snapshot.data.interestUser;
  userInterests: string[] = [];
  suggestedInterests: string[] = [];
  suggestionsLimit = 15;
  requestStatus = false;
  displayMode: string;
  userInterestsFetchError = false;

  autocompleteInterests: string[] = [];

  interestControl = new FormControl('');

  filteredOptions$: Observable<string[]>;

  constructor(
    private route: ActivatedRoute,
    public routingSvc: RoutingService,
    private interestSvc: InterestService,
    private telemetrySvc: TelemetryService,
    private snackBar: MatSnackBar
  ) {
    if (!this.userInterestsResponse.error) {
      this.userInterests = this.userInterestsResponse.data;
    } else {
      this.userInterestsFetchError = true;
    }
  }

  ngOnInit() {
    this.displayMode = this.route.snapshot.queryParamMap.get('mode');
    this.fetchSuggestedInterests();
    this.interestControl.setValue('');
    this.interestSvc.fetchAutocompleteInterests().subscribe(data => {
      this.autocompleteInterests = Array.from(new Set(data)).sort();
      this.filteredOptions$ = this.interestControl.valueChanges.pipe(
        startWith(''),
        map(value => value.toLowerCase()),
        map(value => {
          return this.autocompleteInterests
            .map(interest => {
              const lowerInterest = interest.toLowerCase();
              let score = 0;
              if (lowerInterest === value) {
                score = 100;
              } else if (lowerInterest.startsWith(value)) {
                score = 50;
              } else if (lowerInterest.includes(value)) {
                score = 10;
              }
              return { interest, score };
            })
            .filter(interestScore => interestScore.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(interestScore => interestScore.interest);
        })
      );
    });
  }

  private fetchSuggestedInterests() {
    this.interestSvc.fetchSuggestedInterests().subscribe(data => {
      this.suggestedInterests = data;
      this.removeAlreadyAddedFromRecommended();
    });
  }

  private removeAlreadyAddedFromRecommended() {
    if (this.userInterests.length && this.suggestedInterests.length) {
      const userTopicHash = new Set(this.userInterests);
      this.suggestedInterests = this.suggestedInterests.filter(topic => !Boolean(userTopicHash.has(topic)));
    }
  }

  optionSelected(interest: string) {
    this.interestControl.setValue('');
    this.interestSearch.nativeElement.blur();
    this.addInterest(interest);
  }

  addInterest(interest: string, fromSuggestions = false) {
    interest = interest.trim();
    if (!interest.length) {
      return;
    }
    const duplicate = this.userInterests.filter(userTopic => userTopic.toLowerCase() === interest.toLowerCase());
    if (duplicate.length) {
      this.openSnackBar(this.toastDuplicate.nativeElement.value);
      return;
    }
    this.requestStatus = true;
    this.interestSvc.modifyUserInterests([interest, ...this.userInterests]).subscribe(
      response => {
        if (fromSuggestions) {
          this.suggestedInterests = this.suggestedInterests.filter(suggestedInterest => suggestedInterest !== interest);
        }
        this.userInterests.splice(0, 0, interest);
        this.requestStatus = false;
        this.openSnackBar(this.toastSuccess.nativeElement.value);

        this.telemetrySvc.interestTelemetryEvent(this.userInterests);
      },
      err => {
        this.requestStatus = false;
        this.openSnackBar(this.toastFailure.nativeElement.value);
      }
    );
  }
  removeInterest(interest: string) {
    const interestIndex = this.userInterests.indexOf(interest);
    this.userInterests.splice(interestIndex, 1);
    this.interestSvc.modifyUserInterests(this.userInterests).subscribe(
      response => {
        this.fetchSuggestedInterests();
        this.openSnackBar(this.toastSuccess.nativeElement.value);
      },
      err => {
        this.userInterests.splice(interestIndex, 0, interest);
        this.openSnackBar(this.toastFailure.nativeElement.value);
      }
    );
  }

  private openSnackBar(primaryMsg: string, duration: number = 4000) {
    this.snackBar.open(primaryMsg, undefined, {
      duration
    });
  }
}
