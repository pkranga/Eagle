/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { StepperSelectionEvent, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper'
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core'
import { IWidgetsPlayerMediaData } from '@ws-widget/collection'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ConfigurationsService } from '../../../../../../../library/ws-widget/utils/src/public-api'
import { InterestComponent } from '../profile/routes/interest/components/interest/interest.component'
import { SettingsComponent } from '../profile/routes/settings/settings.component'

@Component({
  selector: 'ws-app-app-setup-home',
  templateUrl: './app-setup-home.component.html',
  styleUrls: ['./app-setup-home.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class AppSetupHomeComponent implements OnInit, AfterViewInit {
  currentIndex = 0
  appLanguage = ''
  chosenLang = ''
  introVideos: any
  objectKeys = Object.keys

  // isInterestEnabled = true

  widgetResolverData: NsWidgetResolver.IRenderConfigWithTypedData<
    IWidgetsPlayerMediaData
  > = {
    widgetData: {
      url: '',
      autoplay: true,
      identifier: '',
    },
    widgetHostClass: 'video-full block',
    widgetSubType: 'playerVideo',
    widgetType: 'player',
    widgetHostStyle: {
      height: '350px',
    },
  }

  @ViewChild('userInterest', { static: false }) interestCompRef:
    | InterestComponent
    | undefined = undefined

  @ViewChild('userSettings', { static: false }) settingsCompRef:
    | SettingsComponent
    | undefined = undefined

  constructor(private configSvc: ConfigurationsService) { }

  ngOnInit(): void {

    // if (this.configSvc.restrictedFeatures) {
    //   this.isInterestEnabled = !this.configSvc.restrictedFeatures.has('interests')
    // }

    this.appLanguage =
      (this.configSvc.activeLocale && this.configSvc.activeLocale.path) || ''
    if (this.configSvc.instanceConfig) {

      this.introVideos = this.configSvc.instanceConfig.introVideo
      // console.log('TYPE: ', this.introVideos)
    }
    this.widgetResolverData = {
      ...this.widgetResolverData,
      widgetData: {
        ...this.widgetResolverData.widgetData,
        url: this.introVideos['en'],
      },
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.interestCompRef) {
        this.interestCompRef.fetchUserInterests()
      }
    },         0)
  }

  prevBtn() {
    this.currentIndex -= 1
  }

  nextBtn() {
    this.currentIndex += 1
  }

  onChange(event: StepperSelectionEvent) {
    this.currentIndex = event.selectedIndex
  }

  langChanged(path: string) {
    this.chosenLang = path
  }

  applyChanges() {
    if (this.settingsCompRef) {
      this.settingsCompRef.applyChanges()
    }
  }

  onItemChange(value: string) {
    this.widgetResolverData = {
      ...this.widgetResolverData,
      widgetData: {
        ...this.widgetResolverData.widgetData,
        url: this.introVideos[value],
      },
    }
    // this.widgetResolverData.widgetData.url = this.introVideos[value]
    // console.log('TYPE: ', this.widgetResolverData)
  }
}
