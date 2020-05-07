/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { ConfigurationsService } from './configurations.service'
import { NsInstanceConfig } from './configurations.model'
import { EventService } from './event.service'
import { WsEvents } from './event.model'
import { filter } from 'rxjs/operators'
import { AuthKeycloakService } from './auth-keycloak.service'
import { LoggerService } from './logger.service'
import { NsContent } from '@ws-widget/collection'

declare var $t: any

@Injectable({
  providedIn: 'root',
})
export class TelemetryService {

  previousUrl: string | null = null
  telemetryConfig: NsInstanceConfig.ITelemetryConfig | null = null
  externalConfig: any = null
  eventData: any = null
  constructor(
    private configSvc: ConfigurationsService,
    private eventsSvc: EventService,
    private authSvc: AuthKeycloakService,
    private logger: LoggerService,
  ) {
    const instanceConfig = this.configSvc.instanceConfig
    if (instanceConfig) {
      this.telemetryConfig = instanceConfig.telemetryConfig
      this.telemetryConfig = {
        ...this.telemetryConfig,
        pdata: {
          ...this.telemetryConfig.pdata,
          pid: navigator.userAgent,
        },
        uid: this.configSvc.userProfile && this.configSvc.userProfile.userId,
        authtoken: this.authSvc.token,
      }
      this.addPlayerListener()
      this.addInteractListener()
      this.addTimeSpentListener()
      this.addSearchListener()
      this.addHearbeatListener()
    }
  }

  start(type: string, mode: string, id: string) {
    if (this.telemetryConfig) {
      $t.start(this.telemetryConfig, id, '1.0', {
        id,
        type,
        mode,
        stageid: '',
      })
    } else {
      this.logger.error('Error Initializing Telemetry. Config missing.')
    }
  }

  end(type: string, mode: string, id: string) {
    $t.end({
      type,
      mode,
      contentId: id,
    })
  }

  heartbeat(type: string, mode: string, id: string) {
    $t.heartbeat({
      id,
      mode,
      type,
    })
  }

  impression() {
    const page = this.getPageDetails()
    if (page.objectId) {
      const config = {
        ...this.telemetryConfig,
        object: {
          id: page.objectId,
        },
      }
      $t.impression(page, config)
    } else {
      $t.impression(page, this.telemetryConfig)
    }
    this.previousUrl = page.pageUrl
  }

  externalImpression(impressionData: any) {
    const page = this.getPageDetails()
    if (page.objectId) {
      this.externalConfig = {
        ...this.telemetryConfig,
        object: {
          id: page.objectId,
        },
      }
    } else {
      this.externalConfig = this.telemetryConfig
    }
    this.eventData = null
    switch (impressionData.subApplicationName) {
      case 'RBCP':
        if (this.telemetryConfig) {
          this.externalConfig.pdata.id = WsEvents.externalTelemetrypdata.RBCP
          this.eventData = impressionData.data
        }
        break
      default:
        break
    }
    if (this.eventData) {
      $t.impression(this.eventData, this.externalConfig)
    }
  }

  addTimeSpentListener() {
    this.eventsSvc.events$
      .pipe(
        filter(event =>
          event &&
          event.eventType === WsEvents.WsEventType.Telemetry &&
          event.data.type === WsEvents.WsTimeSpentType.Page &&
          event.data.mode &&
          event.data,
        ),
      )
      .subscribe(event => {

        if (event.data.state === WsEvents.EnumTelemetrySubType.Loaded) {
          this.start(event.data.type || WsEvents.WsTimeSpentType.Page, event.data.mode || WsEvents.WsTimeSpentMode.View, event.data.pageId)
        }
        if (event.data.state === WsEvents.EnumTelemetrySubType.Unloaded) {
          this.end(event.data.type || WsEvents.WsTimeSpentType.Page, event.data.mode || WsEvents.WsTimeSpentMode.View, event.data.pageId)
        }
      })
  }
  addPlayerListener() {
    this.eventsSvc.events$
      .pipe(
        filter(event =>
          event &&
          event.eventType === WsEvents.WsEventType.Telemetry &&
          event.data.type === WsEvents.WsTimeSpentType.Player &&
          event.data.mode &&
          event.data,
        ),
      )
      .subscribe(event => {
        const content: NsContent.IContent | null = event.data.content
        if (event.data.state === WsEvents.EnumTelemetrySubType.Loaded && (!content ||
          content.isIframeSupported === 'Maybe'
          || event.data.content.url || content.isIframeSupported === 'Yes')) {
          this.start(event.data.type || WsEvents.WsTimeSpentType.Player,
                     event.data.mode || WsEvents.WsTimeSpentMode.Play, event.data.identifier)
        }
        if (event.data.state === WsEvents.EnumTelemetrySubType.Unloaded && (!content ||
          content.isIframeSupported === 'Maybe'
          || event.data.content.url || content.isIframeSupported === 'Yes')) {
          this.end(event.data.type || WsEvents.WsTimeSpentType.Player,
                   event.data.mode || WsEvents.WsTimeSpentMode.Play, event.data.identifier)
        }
      })
  }

  addInteractListener() {
    this.eventsSvc.events$
      .pipe(
        filter((event: WsEvents.WsEventTelemetryInteract) =>
          event && event.data &&
          event.eventType === WsEvents.WsEventType.Telemetry &&
          event.data.eventSubType === WsEvents.EnumTelemetrySubType.Interact,
        ),
      )
      .subscribe(event => {
        this.externalConfig = null
        const page = this.getPageDetails()
        this.eventData = {
          type: event.data.type,
          subtype: event.data.subType,
          object: event.data.object,
          pageid: page.pageid,
          target: { page },
        }
        switch (event.from) {
          case 'RBCP':
            if (this.telemetryConfig) {
              this.externalConfig = this.telemetryConfig
              this.externalConfig.pdata.id = WsEvents.externalTelemetrypdata.RBCP
              this.eventData = event.data
            }
            break
          default:
            break
        }
        $t.interact(this.eventData, this.externalConfig)
      })
  }
  addHearbeatListener() {
    this.eventsSvc.events$
      .pipe(
        filter((event: WsEvents.WsEventTelemetryHeartBeat) =>
          event && event.data &&
          event.eventType === WsEvents.WsEventType.Telemetry &&
          event.data.eventSubType === WsEvents.EnumTelemetrySubType.HeartBeat,
        ),
      )
      .subscribe(event => {
        this.externalConfig = null
        this.eventData = {
          type: event.data.type,
          subtype: event.data.eventSubType,
          identifier: event.data.identifier,
          mimeType: event.data.mimeType,
          mode: event.data.mode,
        }
        switch (event.from) {
          case 'RBCP':
            if (this.telemetryConfig) {
              this.externalConfig = this.telemetryConfig
              this.externalConfig.pdata.id = WsEvents.externalTelemetrypdata.RBCP
              this.eventData = event.data
            }
            break
          default:
            break
        }
        $t.heartbeat(this.eventData, this.externalConfig)
      })
  }

  addSearchListener() {
    this.eventsSvc.events$
      .pipe(
        filter((event: WsEvents.WsEventTelemetrySearch) =>
          event && event.data &&
          event.eventType === WsEvents.WsEventType.Telemetry &&
          event.data.eventSubType === WsEvents.EnumTelemetrySubType.Search,
        ),
      )
      .subscribe(event => {
        $t.search({
          query: event.data.query,
          filters: event.data.filters,
          size: event.data.size,
        })
      })
  }

  getPageDetails() {
    const path = window.location.pathname.replace('/', '')
    const url = path + window.location.search
    return {
      pageid: path,
      pageUrl: url,
      pageUrlParts: path.split('/'),
      refferUrl: this.previousUrl,
      objectId: this.extractContentIdFromUrlParts(path.split('/')),
    }
  }

  extractContentIdFromUrlParts(urlParts: string[]) {
    // TODO: pick toc and viewer url from some configuration
    const tocIdx = urlParts.indexOf('toc')
    const viewerIdx = urlParts.indexOf('viewer')

    if (tocIdx === -1 && viewerIdx === -1) {
      return null
    }

    if (tocIdx !== -1 && tocIdx < urlParts.length - 1) {
      return urlParts[tocIdx + 1] // e.g. url /app/toc/<content_id>
    }

    if (viewerIdx !== -1 && viewerIdx < urlParts.length - 2) {
      return urlParts[viewerIdx + 2] // e.g. url /app/viewer/<content_type>/<content_id>
    }

    return null
  }
}
