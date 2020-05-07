/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { ConfigurationsService, EventService, TelemetryService } from '../../../../../library/ws-widget/utils/src/public-api'
import { WidgetContentService } from '../../../../../library/ws-widget/collection/src/public-api'
import { KeycloakService } from '../../../../../node_modules/keycloak-angular'
import { ActivatedRoute, Router } from '@angular/router'
import { WsEvents } from '@ws-widget/utils'
@Injectable({
  providedIn: 'root',
})
export class IframeRespondService {
  heartBeatinterval: any = null
  continueLearningData = ''
  // contentWindow: any
  rbcpApplication = false
  constructor(
    private configSvc: ConfigurationsService,
    private contentSvc: WidgetContentService,
    private keyCloakSvc: KeycloakService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventSvc: EventService,
    private teleSvc: TelemetryService,
  ) {
    // this.changeContextrespond()
    // this.configSvc.prefChangeNotifier.subscribe(() => {
    //   this.changeContextrespond()
    // })
  }
  loadedRespond(id: string, contentWindow: any, applicationName: string) {
    this.contentSvc.fetchContentHistory(id).subscribe(
      async data => {
        this.continueLearningData = data.continueData
      })
    const token = this.keyCloakSvc.getToken()
    if (this.configSvc && this.configSvc.userProfile) {
      const firstName = this.configSvc.userProfile.userName ?
        this.configSvc.userProfile.userName.split(' ', 2)[0] : ''
      const lastName = this.configSvc.userProfile.userName ?
        this.configSvc.userProfile.userName.split(' ', 2)[1] : ''
      const response = {
        subApplicationName: applicationName,
        requestId: 'LOADED',
        parentContext: {
          url: this.router.url,
          theme: this.configSvc.activeThemeObject ? {
            name: this.configSvc.activeThemeObject.themeName,
            ...this.configSvc.activeThemeObject.color,
          } : '',
          fontSize: '14px',
          locale: 'en',
          darkMode: this.configSvc.isDarkMode,
          subApplicationStartMode: this.activatedRoute.snapshot.queryParams.viewMode ?
            this.activatedRoute.snapshot.queryParams.viewMode : '',
          user: {
            firstName,
            lastName,
            token,
            userId: this.configSvc.userProfile.userId ? this.configSvc.userProfile.userId : '',
          },
          heartbeatFrequency: '200',
        },
        data: this.continueLearningData ? {
          continueLearning: this.continueLearningData,
        } : null,
      }
      contentWindow.postMessage(response, '*')
      this.rbcpApplication = true
    }
  }
  continueLearningRespond(id: string, continueLearning: any) {
    this.contentSvc.saveContinueLearning(
      {
        contextPathId: this.activatedRoute.snapshot.queryParams.collectionId ?
          this.activatedRoute.snapshot.queryParams.collectionId : id,
        resourceId: id,
        data: JSON.stringify({ timestamp: Date.now(), rbcp_data: continueLearning }),
        dateAccessed: Date.now(),
      },
    )
      .toPromise()
      .catch()
  }
  telemetryEvents(tData: any) {
    if (tData) {
      switch (tData.eventId) {
        case 'INTERACT':
          this.eventSvc.dispatchEvent<WsEvents.IWsEventTelemetryInteract>({
            eventType: WsEvents.WsEventType.Telemetry,
            eventLogLevel: WsEvents.WsEventLogLevel.Warn,
            data: tData.data,
            from: tData.subApplicationName,
            to: 'Telemetry',
          })
          break
        case 'HEARTBEAT':
          this.eventSvc.dispatchEvent<WsEvents.IWsEventTelemetryHeartBeat>({
            eventType: WsEvents.WsEventType.Telemetry,
            eventLogLevel: WsEvents.WsEventLogLevel.Trace,
            data: tData.subApplicationName,
            from: tData.subApplicationName,
            to: 'Telemetry',
          })
          break
        case 'IMPRESSION':
          this.teleSvc.externalImpression(tData.data)
          break
        default:
          break
      }
    }
  }
  // changeContextrespond() {
  //   if (this.rbcpApplication && this.configSvc && this.configSvc.userProfile) {
  //     const firstName = this.configSvc.userProfile.userName ?
  //       this.configSvc.userProfile.userName.split(' ', 2)[0] : ''
  //     const lastName = this.configSvc.userProfile.userName ?
  //       this.configSvc.userProfile.userName.split(' ', 2)[1] : ''
  //     const token = this.keyCloakSvc.getToken()
  //     const response = {
  //       subApplicationName: 'RBCP',
  //       requestId: 'CONTEXT_CHANGE',
  //       parentContext: {
  //         url: this.router.url,
  //         theme: this.configSvc.activeThemeObject ? {
  //           ...this.configSvc.activeThemeObject.color,
  //         } : '',
  //         fontSize: '14px',
  //         locale: 'en',
  //         darkMode: this.configSvc.isDarkMode,
  //         subApplicationStartMode: this.activatedRoute.snapshot.queryParams.viewMode ?
  //           this.activatedRoute.snapshot.queryParams.viewMode : '',
  //         user: {
  //           firstName,
  //           lastName,
  //           token,
  //         },
  //         heartbeatFrequency: '200',
  //       },
  //     }
  //     // this.contentWindow.postMessage(response, '*')
  //   }
  // }

}
