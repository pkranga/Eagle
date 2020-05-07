/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core'
import { BtnFollowService } from './btn-follow.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'ws-widget-btn-follow',
  templateUrl: './btn-follow.component.html',
  styleUrls: ['./btn-follow.component.scss'],
})
export class BtnFollowComponent implements OnInit, OnDestroy {
  @Output() unfollowed: EventEmitter<string> = new EventEmitter<string>()
  @Output() followed: EventEmitter<string> = new EventEmitter<string>()
  @Input() widgetData!: { targetId: string; type: string }
  statusFollowed: 'FOLLOWED' | 'NOT_FOLLOWED' | 'PENDING' = 'PENDING'
  private followSubscription: Subscription | null = null
  constructor(private followSvc: BtnFollowService) { }

  ngOnInit() {
    this.followSubscription = this.followSvc
      .isFollowedFor(this.widgetData.targetId)
      .subscribe(isLiked => {
        if (isLiked) {
          this.statusFollowed = 'FOLLOWED'
        } else if (this.followSvc.fetchingFollowing) {
          this.statusFollowed = 'PENDING'
        } else {
          this.statusFollowed = 'NOT_FOLLOWED'
        }
      })

  }

  ngOnDestroy() {
    if (this.followSubscription) {
      this.followSubscription.unsubscribe()
    }
  }

  follow(event: Event) {
    event.stopPropagation()
    this.statusFollowed = 'PENDING'
    this.followSvc.follow(this.widgetData.targetId, this.widgetData.type).subscribe(
      () => {
        this.statusFollowed = 'FOLLOWED'
        this.followed.emit(this.widgetData.targetId)
      },
      () => {
        this.statusFollowed = 'NOT_FOLLOWED'
      },
    )
  }
  unfollow(event: Event) {
    event.stopPropagation()
    this.statusFollowed = 'PENDING'
    this.followSvc.unfollow(this.widgetData.targetId, this.widgetData.type).subscribe(
      () => {
        this.statusFollowed = 'NOT_FOLLOWED'
        this.unfollowed.emit(this.widgetData.targetId)
      },
      () => {
        this.statusFollowed = 'FOLLOWED'
      },
    )
  }

}
