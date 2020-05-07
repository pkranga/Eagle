/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy } from '@angular/core'
import { ConfigurationsService, TFetchStatus, LoggerService } from '@ws-widget/utils'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'
import { ActivatedRoute } from '@angular/router'
import { Subscription, interval } from 'rxjs'
import { MobileAppsService } from '../../../../../../../../../../src/app/services/mobile-apps.service'
import { IEvent } from '../models/event.model'
import { EventsService } from '../services/events.service'

@Component({
  selector: 'ws-app-live-events',
  templateUrl: './live-events.component.html',
  styleUrls: ['./live-events.component.scss'],
})
export class LiveEventsComponent implements OnInit, OnDestroy {
  liveEvents!: IEvent[]
  liveUrl: string | null
  showIframeSupportWarning = true
  safeLiveUrl: SafeResourceUrl | undefined
  urlHasLiveUrl = false
  fetchStatus: TFetchStatus = 'fetching'
  notifierSubscription: Subscription | undefined
  userRoles = new Set<string>()
  liveStream = 'ROLES_LIVE_STREAM'

  constructor(
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public mobileAppsSvc: MobileAppsService,
    // private snackBar: MatSnackBar,
    public configSvc: ConfigurationsService,
    private eventsSvc: EventsService,
    private logger: LoggerService,
  ) {
    this.liveUrl = ''
    this.userRoles.add(this.liveStream)
  }

  ngOnInit() {
    this.eventsSvc.fetchLiveEvents().subscribe(
      (response: IEvent[]) => {
        this.logger.log('Got response', response)
        const events = (response || []).filter(event => new Date(event.end_time) > new Date())
        this.liveEvents = events
        this.fetchStatus = 'done'
      },
      () => {
        this.fetchStatus = 'error'
      },
    )

    this.activatedRoute.queryParamMap.subscribe(qparamsMap => {
      this.liveUrl = qparamsMap.get('liveUrl')
      if (this.liveUrl) {
        this.urlHasLiveUrl = true
        if (this.notifierSubscription) {
          this.notifierSubscription.unsubscribe()
        }
        // this.notifier('RUNNING')
        this.notifierSubscription = interval(30000).subscribe(() => {
          // this.notifier('RUNNING')
        })
        this.safeLiveUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.liveUrl)
      } else {
        this.urlHasLiveUrl = false
      }
    })
  }

  ngOnDestroy() {
    if (this.notifierSubscription) {
      this.notifierSubscription.unsubscribe()
    }
  }

  isCurrentTimeSmall(timestamp: string) {
    return new Date() < new Date(timestamp)
  }

  get currentTime() {
    return new Date()
  }
}
