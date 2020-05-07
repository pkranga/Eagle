/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EUserRoles } from '../../../../constants/enums.constant';
import { IPrivacyPreferences } from '../../../../models/privacy.model';
import { FetchStatus } from '../../../../models/status.model';
import { TValidFonts } from '../../../../models/instanceConfig.model';
import { ConfigService } from '../../../../services/config.service';
import { MobileAppsService } from '../../../../services/mobile-apps.service';
import { RoutingService } from '../../../../services/routing.service';
import { ValuesService } from '../../../../services/values.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  @ViewChild('successToast', { static: true }) successToast: ElementRef;
  @ViewChild('failureToast', { static: true }) failureToast: ElementRef;
  isLangChanged = false;
  settings = this.configSvc.instanceConfig.features.settings;
  isPrivacyAvailable = this.configSvc.instanceConfig.features.privacy.available;
  isSiemensAvailable = this.configSvc.instanceConfig.features.siemens.available;
  appLanguage = '';
  selectedTheme = '';
  settingsSubFeatures = this.configSvc.instanceConfig.features.settings.subFeatures;
  selectedFont: TValidFonts;
  privacyPreferences: IPrivacyPreferences;
  fetchPrivacyStatus: FetchStatus;
  selectedInstanceConfigFile: string = this.configSvc.selectedConfigFile;
  ROLES = EUserRoles;
  otherDomainsConfigurations = this.configSvc.preLoginConfig.domainConfigurationsMap;
  languageConfig = this.configSvc.instanceConfig.features.settings.config.language;
  selectedDomain: {
    domainName: string;
    jsonFile: string;
  } = {
      domainName: '',
      jsonFile: ''
    };
  constructor(
    public routingSvc: RoutingService,
    public mobileAppsSvc: MobileAppsService,
    private valuesSvc: ValuesService,
    public router: Router,
    private configSvc: ConfigService,
  ) { }

  ngOnInit() {
    this.selectedDomain.domainName = location.host;
    this.valuesSvc.language$.subscribe(langCode => {
      const langObj = this.settings.config.language.find(u => u.code === langCode);
      if (langObj) {
        this.appLanguage = langObj.isSupported ? langObj.code : '';
      }
    });
    this.isLangChanged = this.isSiemensAvailable && this.appLanguage && this.appLanguage !== '' ? true : false;
    this.valuesSvc.theme$.subscribe(themeObj => {
      this.selectedTheme = themeObj.name;
    });

    this.valuesSvc.font$.subscribe(fontSize => {
      this.selectedFont = fontSize;
    });

    this.fetchPrivacyStatus = 'fetching';
    this.valuesSvc.privacy().subscribe(
      privacy => {
        this.fetchPrivacyStatus = 'done';
        this.privacyPreferences = privacy ? privacy : this.settings.config.defaultPrivacy;
      },
      err => {
        console.log('err', err);
        this.fetchPrivacyStatus = 'error';
      }
    );
  }

  changeTheme(themeName?: string) {
    this.valuesSvc.updateTheme(themeName || this.selectedTheme);
  }

  changeFont() {
    this.valuesSvc.updateFont(this.selectedFont);
  }

  changeLanguage() {
    this.valuesSvc.updateLanguage(
      this.appLanguage,
      (document.getElementById('lang-change-toast') as HTMLInputElement).value
    );
  }

  changePrivacySetting() {
    this.valuesSvc.updatePrivacySetting(this.privacyPreferences).subscribe();
  }

  openAppSettings() {
    this.mobileAppsSvc.viewSettings();
  }

  changeDomain() {
    this.configSvc.simulateInstance(this.selectedInstanceConfigFile);
  }

  resetDomain() {
    this.configSvc.resetInstanceConfig();
  }
}
