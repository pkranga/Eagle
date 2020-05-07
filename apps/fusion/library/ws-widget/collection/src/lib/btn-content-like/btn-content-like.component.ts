/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { Subscription } from 'rxjs'
import { BtnContentLikeService } from './btn-content-like.service'
import { ConfigurationsService, EventService, WsEvents } from '../../../../utils/src/public-api'

@Component({
  selector: 'ws-widget-btn-content-like',
  templateUrl: './btn-content-like.component.html',
  styleUrls: ['./btn-content-like.component.scss'],
})
export class BtnContentLikeComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, NsWidgetResolver.IWidgetData<{
    identifier: string,
    isDisabled?: boolean, totalLikes?: { [key: string]: number },
  }> {
  @Input() widgetData!: { identifier: string, isDisabled?: boolean }
  @Input() likesCount = 0
  @Input() color: 'primary' | 'accent' | 'default' = 'default'

  status: 'LIKED' | 'NOT_LIKED' | 'PENDING' = 'PENDING'
  isRestricted = false
  rootOrg = this.configSvc.rootOrg
  private likeSubscription: Subscription | null = null
  constructor(
    private events: EventService,
    private btnLikeSvc: BtnContentLikeService,
    private configSvc: ConfigurationsService,
  ) {
    super()
    if (this.configSvc.restrictedFeatures) {
      this.isRestricted = this.configSvc.restrictedFeatures.has('contentLike')
    }
  }

  ngOnInit() {
    if (!this.isRestricted) {
      this.likeSubscription = this.btnLikeSvc
        .isLikedFor(this.widgetData.identifier)
        .subscribe(isLiked => {
          if (isLiked) {
            this.status = 'LIKED'
          } else if (this.btnLikeSvc.fetchingLikes) {
            this.status = 'PENDING'
          } else {
            this.status = 'NOT_LIKED'
          }
        })
    }
  }
  ngOnDestroy() {
    if (this.likeSubscription) {
      this.likeSubscription.unsubscribe()
    }
  }
  like(event: Event) {
    event.stopPropagation()
    this.raiseTelemetry('like')
    this.status = 'PENDING'
    this.btnLikeSvc.like(this.widgetData.identifier).subscribe(
      (data: { [key: string]: number }) => {
        if (data) {
          this.likesCount = data[this.widgetData.identifier]
        }
        this.status = 'LIKED'
      },
      () => {
        this.status = 'NOT_LIKED'
      },
    )
  }
  unlike(event: Event) {
    event.stopPropagation()
    this.raiseTelemetry('unlike')
    this.status = 'PENDING'
    this.btnLikeSvc.unlike(this.widgetData.identifier).subscribe(
      (data: { [key: string]: number }) => {
        if (data) {
          this.likesCount = data[this.widgetData.identifier]
        }
        this.status = 'NOT_LIKED'
        this.events.dispatchEvent({
          eventType: WsEvents.WsEventType.Action,
          eventLogLevel: WsEvents.WsEventLogLevel.Info,
          from: 'favourites',
          to: 'favouritesStrip',
          data: null,
        })
      },
      () => {
        this.status = 'LIKED'
      },
    )
  }

  raiseTelemetry(action: 'like' | 'unlike') {
    this.events.raiseInteractTelemetry(
      action,
      'content',
      {
        contentId: this.widgetData.identifier,
      },
    )
  }
}
