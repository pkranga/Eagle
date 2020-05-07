/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core'
import { NsContent } from '@ws-widget/collection'
import { ConfigurationsService, EventService, UtilityService } from '@ws-widget/utils'
import { Subscription } from 'rxjs'
import { SafeHtml, DomSanitizer } from '@angular/platform-browser'
@Component({
  selector: 'ws-app-learning-card',
  templateUrl: './learning-card.component.html',
  styleUrls: ['./learning-card.component.scss'],
})
export class LearningCardComponent implements OnInit, OnChanges, OnDestroy {
  @Input()
  displayType: 'basic' | 'advanced' = 'basic'
  @Input()
  content: NsContent.IContent = {} as NsContent.IContent
  contentProgress = 0
  isExpanded = false
  isIntranetAllowedSettings = false
  defaultThumbnail = ''
  prefChangeSubscription: Subscription | null = null
  description: SafeHtml = ''
  constructor(
    private events: EventService,
    private configSvc: ConfigurationsService,
    private utilitySvc: UtilityService,
    private domSanitizer: DomSanitizer,
  ) { }

  get greyedOut() {
    if (this.content.status === 'Deleted' || this.content.status === 'Expired') {
      return true
    }
    return false
  }

  ngOnInit() {
    this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    this.prefChangeSubscription = this.configSvc.prefChangeNotifier.subscribe(() => {
      this.isIntranetAllowedSettings = this.configSvc.isIntranetAllowed
    })
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.defaultThumbnail = instanceConfig.logos.defaultContent
    }

  }
  ngOnChanges(changes: SimpleChanges) {
    for (const prop in changes) {
      if (prop === 'content' && this.content.description) {
        this.content.description = this.content.description.replace(/<br>/g, '')
        this.description = this.domSanitizer.bypassSecurityTrustHtml(this.content.description)
      }
    }
  }

  ngOnDestroy() {
    if (this.prefChangeSubscription) {
      this.prefChangeSubscription.unsubscribe()
    }
  }

  raiseTelemetry() {
    this.events.raiseInteractTelemetry(
      'click',
      'cardSearch',
      {
        contentId: this.content.identifier,

      },
    )
  }

  isIntranetContentAllowed() {
    if (this.content.isInIntranet && this.utilitySvc.isMobile) {
      return this.isIntranetAllowedSettings
    }
    return true
  }
}
