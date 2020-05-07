/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material'
import { FormControl } from '@angular/forms'
import { Observable, of } from 'rxjs'
// import { startWith, map } from 'rxjs/operators'
import { IResolveResponse } from 'library/ws-widget/utils/src/lib/resolvers/resolver.model'
import { InterestService } from '../../services/interest.service'
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators'
import { EventService, ConfigurationsService } from '@ws-widget/utils'

@Component({
  selector: 'ws-app-interest',
  templateUrl: './interest.component.html',
  styleUrls: ['./interest.component.scss'],
})
export class InterestComponent implements OnInit {
  @ViewChild('toastSuccess', { static: true }) toastSuccess!: ElementRef<any>
  @ViewChild('toastDuplicate', { static: true }) toastDuplicate!: ElementRef<
    any
  >
  @ViewChild('toastFailure', { static: true }) toastFailure!: ElementRef<any>
  @ViewChild('interestSearch', { static: true }) interestSearch!: ElementRef<
    any
  >
  userInterestsResponse: IResolveResponse<string[]> = this.route.snapshot.data
    .interests
  userInterests: string[] = []
  suggestedInterests: string[] = []
  suggestionsLimit = 15
  displayMode = ''
  isFetchingUserInterests = false
  userInterestsFetchError = false
  showInfo = true

  autocompleteInterests: string[] = []

  interestControl = new FormControl('')

  filteredOptions$: Observable<string[]> = of([])
  appName!: string

  constructor(
    private events: EventService,
    private route: ActivatedRoute,
    private interestSvc: InterestService,
    private snackBar: MatSnackBar,
    private configSvc: ConfigurationsService,
  ) {
    if (
      this.userInterestsResponse &&
      this.userInterestsResponse.data != null &&
      !this.userInterestsResponse.error
    ) {
      this.userInterests = this.userInterestsResponse.data
    } else if (this.userInterestsResponse && this.userInterestsResponse.error) {
      this.userInterestsFetchError = true
    }
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.details.appName) {
      this.appName = this.configSvc.instanceConfig.details.appName
    }
  }

  ngOnInit() {
    // this.displayMode = this.route.snapshot.queryParamMap.get('mode')
    this.fetchSuggestedInterests()
    this.interestControl.setValue('')

    this.filteredOptions$ = this.interestControl.valueChanges.pipe(
      startWith(this.interestControl.value),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(value => this.interestSvc.fetchAutocompleteInterestsV2(value)),
    )

    // this.filteredOptions$ = this.interestControl.valueChanges.pipe()

    // this.interestSvc.fetchSuggestedInterestV2().subscribe(data => {
    //   this.autocompleteInterests = Array.from(new Set(data)).sort()
    //   this.filteredOptions$ = this.interestControl.valueChanges.pipe(
    //     startWith(''),
    //     map(value => value.toLowerCase()),
    //     map(value => {
    //       return this.autocompleteInterests
    //         .map(interest => {
    //           const lowerInterest = interest.toLowerCase()
    //           let score = 0
    //           if (lowerInterest === value) {
    //             score = 100
    //           } else if (lowerInterest.startsWith(value)) {
    //             score = 50
    //           } else if (lowerInterest.includes(value)) {
    //             score = 10
    //           }
    //           return { interest, score }
    //         })
    //         .filter(interestScore => interestScore.score > 0)
    //         .sort((a, b) => b.score - a.score)
    //         .map(interestScore => interestScore.interest)
    //     }),
    //   )
    // })
  }

  /**
   * Below function is added to fetch user interests from parent comp or in
   * some other case if it is req in this component itself in the future
   */
  fetchUserInterests() {
    this.isFetchingUserInterests = true
    this.interestSvc.fetchUserInterestsV2().subscribe(
      data => {
        this.isFetchingUserInterests = false
        this.userInterests = data
      },
      () => {
        this.isFetchingUserInterests = false
        this.userInterestsFetchError = true
      },
    )
  }

  private fetchSuggestedInterests() {
    this.interestSvc.fetchSuggestedInterestV2().subscribe(data => {
      // console.log('Interest: ', data)
      this.suggestedInterests = data
      this.removeAlreadyAddedFromRecommended()
    })
  }

  private removeAlreadyAddedFromRecommended() {
    if (this.userInterests.length && this.suggestedInterests.length) {
      const userTopicHash = new Set(this.userInterests)
      this.suggestedInterests = this.suggestedInterests.filter(
        topic => !Boolean(userTopicHash.has(topic)),
      )
    }
  }
  optionSelected(interest: string) {
    this.interestControl.setValue('')
    this.interestSearch.nativeElement.blur()
    this.addInterest(interest, true)
  }

  addInterest(interest: string, fromSuggestions = false, recommendIndex = -1) {
    const tempInterest = interest.trim()
    if (!tempInterest.length) {
      return
    }
    const duplicate = this.userInterests.filter(
      userTopic => userTopic.toLowerCase() === tempInterest.toLowerCase(),
    )
    if (duplicate.length) {
      this.openSnackBar(this.toastDuplicate.nativeElement.value)
      return
    }
    if (fromSuggestions) {
      this.suggestedInterests = this.suggestedInterests.filter(
        suggestedInterest => suggestedInterest !== tempInterest,
      )
    }
    this.userInterests.splice(0, 0, tempInterest)
    this.raiseTelemetry('add', tempInterest)
    this.interestSvc.addUserInterest(tempInterest).subscribe(
      _response => {
        this.openSnackBar(this.toastSuccess.nativeElement.value)
      },
      _err => {
        this.userInterests = this.userInterests.filter(
          unitInterest => unitInterest !== interest,
        )
        if (fromSuggestions && recommendIndex > -1) {
          this.suggestedInterests.splice(recommendIndex, 0, interest)
        }
        this.openSnackBar(this.toastFailure.nativeElement.value)
      },
    )
  }
  removeInterest(interest: string) {
    this.raiseTelemetry('remove', interest)
    const interestIndex = this.userInterests.indexOf(interest)
    this.userInterests.splice(interestIndex, 1)
    this.interestSvc.removeUserInterest(interest).subscribe(
      _response => {
        this.fetchSuggestedInterests()
        this.openSnackBar(this.toastSuccess.nativeElement.value)
      },
      _err => {
        this.userInterests.splice(interestIndex, 0, interest)
        this.openSnackBar(this.toastFailure.nativeElement.value)
      },
    )
  }

  private openSnackBar(primaryMsg: string, duration: number = 4000) {
    this.snackBar.open(primaryMsg, undefined, {
      duration,
    })
  }

  raiseTelemetry(action: 'add' | 'remove', interest: string) {
    this.events.raiseInteractTelemetry('interest', action, { interest })
  }
}
