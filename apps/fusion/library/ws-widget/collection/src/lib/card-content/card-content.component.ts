/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { NsWidgetResolver, WidgetBaseComponent } from '@ws-widget/resolver'
import { ConfigurationsService, EventService, UtilityService } from '@ws-widget/utils'
import { Subscription } from 'rxjs'
import { NsGoal } from '../btn-goals/btn-goals.model'
import { NsPlaylist } from '../btn-playlist/btn-playlist.model'
import { NsContent } from '../_services/widget-content.model'
import { NsCardContent } from './card-content.model'
import { MatDialog } from '@angular/material'
import { MiniProfileComponent } from '../mini-profile/mini-profile.component'

@Component({
  selector: 'ws-widget-card-content',
  templateUrl: './card-content.component.html',
  styleUrls: ['./card-content.component.scss'],
})
export class CardContentComponent extends WidgetBaseComponent
  implements OnInit, OnDestroy, AfterViewInit, NsWidgetResolver.IWidgetData<NsCardContent.ICard> {
  @Input() widgetData!: NsCardContent.ICard
  defaultThumbnail = ''
  showFlip = false
  isCardFlipped = false
  showIsMode = false
  isGoalsEnabled = false

  btnPlaylistConfig: NsPlaylist.IBtnPlaylist | null = null
  btnGoalsConfig: NsGoal.IBtnGoal | null = null
  prefChangeSubscription: Subscription | null = null
  isIntranetAllowedSettings = false
  constructor(
    private dialog: MatDialog,
    private events: EventService,
    private configSvc: ConfigurationsService,
    private utilitySvc: UtilityService,
  ) {
    super()
  }

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isGoalsEnabled = !this.configSvc.restrictedFeatures.has('goals')
    }
    this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    this.prefChangeSubscription = this.configSvc.prefChangeNotifier.subscribe(() => {
      this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    })

    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent
    }

    if (this.widgetData) {
      this.btnPlaylistConfig = {
        contentId: this.widgetData.content.identifier,
        contentName: this.widgetData.content.name,
        contentType: this.widgetData.content.contentType,
        mode: 'dialog',
      }
      this.btnGoalsConfig = {
        contentId: this.widgetData.content.identifier,
        contentName: this.widgetData.content.name,
        contentType: this.widgetData.content.contentType,
      }
      this.modifySensibleContentRating()
    }

    // required for knowledge board
    // TODO: make it more generic
    this.showFlip = Boolean(this.widgetData.content.reason)
    if (this.widgetData.content.mode) {
      this.showIsMode = this.isLatest(this.convertToISODate(this.widgetData.content.addedOn))
    }
  }

  ngOnDestroy() {
    if (this.prefChangeSubscription) {
      this.prefChangeSubscription.unsubscribe()
    }
  }

  ngAfterViewInit() {
    // this.assignThumbnail()
  }

  private modifySensibleContentRating() {
    if (
      this.widgetData.content &&
      this.widgetData.content.averageRating &&
      typeof this.widgetData.content.averageRating !== 'number'
    ) {
      this.widgetData.content.averageRating = (this.widgetData.content.averageRating as any)[this.configSvc.rootOrg || '']
    }
    this.widgetData.content.averageRating = this.widgetData.content.averageRating || 0
  }

  // private assignThumbnail() {
  //   const thumbnailElement = document.getElementById(`card_${this.widgetData.content.identifier}`) as HTMLImageElement
  //   if (thumbnailElement) {
  //     try {
  //       const observer = new IntersectionObserver(
  //         entries => {
  //           entries.forEach(entry => {
  //             const { isIntersecting } = entry
  //             if (isIntersecting) {
  //               thumbnailElement.src = this.widgetData.content.appIcon
  //               observer.disconnect()
  //             }
  //           })
  //         },
  //       )
  //       observer.observe(thumbnailElement)
  //     } catch (e) {
  //       thumbnailElement.src = this.widgetData.content.appIcon
  //     }
  //   }
  // }

  get isKnowledgeBoard() {
    return (
      (this.widgetData.content && this.widgetData.content.contentType) ===
      NsContent.EContentTypes.KNOWLEDGE_BOARD
    )
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry('click', `${this.widgetType}-${this.widgetSubType}`, {
      contentId: this.widgetData.content.identifier,
      contentType: this.widgetData.content.contentType,
      context: this.widgetData.context,
    })
  }

  get isGreyedImage() {
    if (
      (this.widgetData.content && this.widgetData.content.status === 'Deleted') ||
      this.widgetData.content.status === 'Expired'
    ) {
      return true
    }
    return false
  }

  convertToISODate(date = ''): Date {
    try {
      return new Date(
        `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}${date.substring(
          8,
          11,
        )}:${date.substring(11, 13)}:${date.substring(13, 15)}.000Z`,
      )
    } catch (ex) {
      return new Date(new Date().setMonth(new Date().getMonth() - 1))
    }
  }

  isLatest(addedOn: Date) {
    if (addedOn) {
      const dateOffset = (24 * 60 * 60 * 1000) * 7
      const last7Day = new Date()
      last7Day.setTime(last7Day.getTime() - dateOffset)
      if (addedOn.getTime() >= last7Day.getTime()) {
        return true
      }
    }
    return false
  }

  get showIntranetContent() {
    if (this.widgetData.content.isInIntranet && this.utilitySvc.isMobile) {
      return !this.isIntranetAllowedSettings
    }
    return false
  }

  get isLiveOrMarkForDeletion() {
    if (
      !this.widgetData.content.status ||
      this.widgetData.content.status === 'Live' ||
      this.widgetData.content.status === 'MarkedForDeletion') {
      return true
    }
    return false
  }

  openDialog(wid: string, event: Event): void {
    event.preventDefault()
    event.stopPropagation()
    const dialogRef = this.dialog.open(MiniProfileComponent, {
      width: '410px',
      data: wid,
    })
    dialogRef.afterClosed().subscribe((_result: any) => {
    })
  }
}
