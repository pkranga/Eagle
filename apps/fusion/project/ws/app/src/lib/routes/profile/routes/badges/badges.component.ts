/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { TFetchStatus, LoggerService, ConfigurationsService } from '@ws-widget/utils'
import { IBadgeResponse } from './badges.model'
import { ActivatedRoute } from '@angular/router'
import { Subscription, fromEvent } from 'rxjs'
import { BadgesService } from './badges.service'
import { MatSnackBar } from '@angular/material'
import { debounceTime, throttleTime } from 'rxjs/operators'

@Component({
  selector: 'ws-app-badges',
  templateUrl: './badges.component.html',
  styleUrls: ['./badges.component.scss'],
})
export class BadgesComponent implements OnInit {
  status: TFetchStatus = 'none'
  isUpdating = false
  badges: IBadgeResponse
  paramSubscription: Subscription | null = null
  userName: string | undefined
  userEmail: string | undefined
  disableNext: boolean
  disablePrev: boolean
  scrollObserver: Subscription | undefined

  @ViewChild('cardContents', { read: ElementRef, static: false }) public cardContents:
    | ElementRef
    | undefined

  constructor(
    private route: ActivatedRoute,
    private badgesSvc: BadgesService,
    private logger: LoggerService,
    private snackBar: MatSnackBar,
    private configSvc: ConfigurationsService,
  ) {
    this.badges = {
      canEarn: [],
      closeToEarning: [],
      earned: [],
      lastUpdatedDate: '',
      recent: [],
      totalPoints: [{ collaborative_points: 0, learning_points: 0 }],
    }
    if (this.configSvc.userProfile) {
      this.userName = this.configSvc.userProfile.userName
    }
    if (this.userName) {
      this.userName = this.userName.split(' ')[0]
    }
    // if (this.authSvc.userEmail) {
    // this.userEmail = this.authSvc.userEmail
    // }
    this.disablePrev = true
    this.disableNext = false
  }

  ngOnInit() {
    this.paramSubscription = this.route.data.subscribe(async data => {
      this.logger.log('Data check from resolver', data)
      this.badges = data.badges.data
      this.status = 'done'
    })

    this.logger.log('var check', this.badges)

    setTimeout(() => {
      this.initializeObserver()
      this.updateNavigationButtons()
    },         100)
  }

  reCalculateBadges() {
    this.isUpdating = true
    this.badgesSvc.reCalculateBadges().subscribe(
      _ => {
        this.badgesSvc.fetchBadges().subscribe(
          (data: IBadgeResponse) => {
            this.badges = data
            this.isUpdating = false
            this.snackBar.open('Badges Refreshed')
          },
          (err: string) => {
            this.logger.log(err)
            this.isUpdating = false
          },
        )
      },
      (err: string) => {
        this.logger.log(err)
        this.isUpdating = false
      },
    )
  }

  initializeObserver() {
    if (this.cardContents) {
      this.scrollObserver = fromEvent(this.cardContents.nativeElement, 'scroll')
        .pipe(debounceTime(200))
        .pipe(throttleTime(200))
        .subscribe(_ => {
          if (this.cardContents) {
            this.updateNavigationButtonStatus(this.cardContents.nativeElement as HTMLElement)
          }
        })
    }
  }

  public scrollRight(): void {
    if (this.cardContents) {
      const clientWidth = this.cardContents.nativeElement.clientWidth
      this.cardContents.nativeElement.scrollTo({
        left: this.cardContents.nativeElement.scrollLeft + clientWidth * 0.9,
        behavior: 'smooth',
      })
    }
  }

  public scrollLeft(): void {
    if (this.cardContents) {
      const clientWidth = this.cardContents.nativeElement.clientWidth
      this.cardContents.nativeElement.scrollTo({
        left: this.cardContents.nativeElement.scrollLeft - clientWidth * 0.9,
        behavior: 'smooth',
      })
    }
  }

  updateNavigationButtons() {
    if (this.cardContents) {
      if (
        this.cardContents.nativeElement.scrollWidth <= this.cardContents.nativeElement.clientWidth
      ) {
        this.disableNext = true
      }
    }
  }

  updateNavigationButtonStatus(element: HTMLElement) {
    this.updateNavigationButtons()
    if (element.scrollLeft === 0) {
      this.disablePrev = true
    } else {
      this.disablePrev = false
    }
    if (element.scrollWidth === element.clientWidth + element.scrollLeft) {
      this.disableNext = true
    } else {
      this.disableNext = false
    }
  }

  simulateDummyData() {
    this.badges.earned = [
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Duelist.png?type=assets',
        last_received_date: '2018-10-12',
        badge_group: 'Quiz',
        badge_order: 'B001',
        is_new: 0,
        received_count: 1,
        threshold: 1,
        first_received_date: '2018-10-12',
        how_to_earn: '',
        hover_text: 'Complete a quiz and get this!',
        message: 'You have broken the rookie spell! Good job.',
        badge_name: 'Duelist',
        badge_id: 'Quiz1',
        progress: 100,
        badge_type: 'O',
      },
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Warrior.png?type=assets',
        last_received_date: '2018-10-12',
        badge_group: 'Course',
        badge_order: 'C001',
        is_new: 0,
        received_count: 1,
        threshold: 1,
        first_received_date: '2018-10-12',
        how_to_earn: '',
        hover_text: 'Complete a course and get this!',
        message: 'You took one giant leap towards your goal.',
        badge_name: 'Warrior',
        badge_id: 'Course1',
        progress: 100,
        badge_type: 'O',
      },
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Studious Bee.png?type=assets',
        last_received_date: '2018-10-12',
        badge_group: 'Duration',
        badge_order: 'D001',
        is_new: 0,
        received_count: 0,
        badge_id: '30MWeek',
        progress: 0,
        threshold: 5,
        badge_type: 'R',
        message: 'You took one giant leap towards your goal. Welcome to lifelong learning.',
        how_to_earn: 'Learn for 30 minutes each day for 5 days in a week.',
        hover_text: '5 more days to go!',
        first_received_date: '2018-10-12',
        badge_name: 'Studious Bee',
      },
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Soaring Eagle.png?type=assets',
        badge_group: 'Duration',
        badge_order: 'D002',
        is_new: 0,
        received_count: 0,
        threshold: 25,
        how_to_earn: 'Learn 30 minutes each day for 25 days in a month.',
        hover_text: '24 more days to go!',
        badge_name: 'Soaring Eagle',
        badge_id: '30MMonth',
        progress: 4,
        badge_type: 'R',
        first_received_date: '2018-10-12',
        message: 'You took one giant leap towards your goal. Welcome to lifelong learning.',
        last_received_date: '2018-10-12',
      },
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Lightning Deer.png?type=assets',
        badge_group: 'Duration',
        badge_order: 'E001',
        is_new: 0,
        received_count: 0,
        threshold: 4,
        how_to_earn: 'Learn 4 hours a day',
        hover_text: '222 minutes to go!',
        badge_name: 'Lightning Deer',
        badge_id: '4Day',
        progress: 7.7318473,
        badge_type: 'R',
        first_received_date: '2018-10-12',
        message: 'You took one giant leap towards your goal. Welcome to lifelong learning.',
        last_received_date: '2018-10-12',
      },
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Power Tiger.png?type=assets',
        badge_group: 'Duration',
        badge_order: 'E002',
        is_new: 0,
        received_count: 0,
        threshold: 20,
        how_to_earn: 'Learn 20 hours in a week',
        hover_text: '1182 minutes to go!',
        badge_name: 'Power Tiger',
        badge_id: '20Week',
        progress: 1.5463694,
        badge_type: 'R',
        first_received_date: '2018-10-12',
        message: 'You took one giant leap towards your goal. Welcome to lifelong learning.',
        last_received_date: '2018-10-12',
      },
    ]

    this.badges.closeToEarning = [
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Ace.png?type=assets',
        badge_group: 'Quiz',
        badge_order: 'B002',
        is_new: 0,
        received_count: 0,
        threshold: 25,
        how_to_earn: 'Complete 25 quiz resources',
        hover_text: '19 more quizzes, to go!',
        badge_name: 'Ace',
        badge_id: 'Quiz25',
        progress: 24,
        badge_type: 'O',
      },
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Genie.png?type=assets',
        badge_group: 'Quiz',
        badge_order: 'B003',
        is_new: 0,
        received_count: 0,
        threshold: 100,
        how_to_earn: 'Complete 100 quiz resources',
        hover_text: '94 more quizzes, to go!',
        badge_name: 'Genie',
        badge_id: 'Quiz100',
        progress: 6,
        badge_type: 'O',
      },
      {
        image: '/apis/proxies/v8/content/Achievements/Badges/Wizard.png?type=assets',
        badge_group: 'Quiz',
        badge_order: 'B004',
        is_new: 0,
        received_count: 0,
        threshold: 250,
        how_to_earn: 'Complete 250 quiz resources',
        hover_text: '244 more quizzes, to go!',
        badge_name: 'Wizard',
        badge_id: 'Quiz250',
        progress: 2.4,
        badge_type: 'O',
      },
    ]
  }
}
