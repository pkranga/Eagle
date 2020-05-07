/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject, fromEvent, Observable, ReplaySubject } from 'rxjs';
import { filter, map, take, tap } from 'rxjs/operators';
import { KEY_SELECTED_FONT, KEY_SELECTED_LANGUAGE, KEY_SELECTED_THEME } from '../constants/prefs.constant';
import { ICommEvent, ITheme, IThemeResponse } from '../models/comm-events.model';
import { IInstanceTheme, TValidFonts } from '../models/instanceConfig.model';
import { IPrivacyPreferences } from '../models/privacy.model';
import logger from '../utils/logger';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { MobileAppsService } from './mobile-apps.service';
import { UserService } from './user.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})
export class ValuesService {
  private themeObject$ = new ReplaySubject<IInstanceTheme>(1);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private userSvc: UserService,
    private matPlatform: Platform,
    private snackBar: MatSnackBar,
    private authSvc: AuthService,
    private mobileSvc: MobileAppsService,
    private configSvc: ConfigService,
    private utilitySvc: UtilityService
  ) {
    this.setInitialPreferences();
    this.handleThemeRequest();
  }

  private preferences: any = {};
  // public CONTENT_URL_PREFIX_REGEX = /https?:\/\/((\d{2,3}.){3}\d{2,3}:?\d{0,4}|content-service|wn-content|lex-content-service)/;
  public CONTENT_URL_PREFIX_REGEX = /http:\/\/private-[^/]+/;
  public readonly theme$: Observable<IInstanceTheme> = this.themeObject$.asObservable();
  public font$: Observable<TValidFonts> = new BehaviorSubject<TValidFonts>(null);
  public language$: Observable<string> = new BehaviorSubject<string>(null);
  public isXSmall$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(map((res: BreakpointState) => res.matches));
  public isLtMedium$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.XSmall, Breakpoints.Small])
    .pipe(map((res: BreakpointState) => res.matches));
  public secondaryBarColor$ = new BehaviorSubject('primary');

  public get isIos() {
    return this.matPlatform.IOS;
  }
  public get isAndroid() {
    return this.matPlatform.ANDROID;
  }
  public updatePrivacySetting(privacy: IPrivacyPreferences) {
    return this._updateIndividualPreference('privacy', privacy);
  }

  public privacy(email?: string): Observable<IPrivacyPreferences> {
    return this.userSvc.fetchUserPreference(email).pipe(
      map(prefs => (prefs && prefs.privacy ? JSON.parse(prefs.privacy) : null)),
      tap(prefs => (this.preferences.privacy = prefs))
    );
  }

  private handleThemeRequest() {
    fromEvent<MessageEvent>(window, 'message')
      .pipe(filter(event => event && event.data && event.data.type === 'THEME_REQUEST'))
      .subscribe(async (event: MessageEvent) => {
        const contentWindow = event.source as Window;
        const themeObj = await this.theme$.pipe(take(1)).toPromise();
        const themeData: ITheme = {
          themeName: themeObj.name,
          themeDetails: themeObj.colors
        };
        const response: ICommEvent<IThemeResponse> = {
          app: 'WEB_PORTAL',
          type: 'THEME_RESPONSE',
          state: 'NONE',
          plugin: 'NONE',
          data: {
            id: event.data && event.data.data && event.data.data.id,
            theme: themeData
          }
        };
        contentWindow.postMessage(response, '*');
      });
  }

  private async notifyThemeChange() {
    const themeObj = await this.theme$.pipe(take(1)).toPromise();
    const themeData: ITheme = {
      themeName: themeObj.name,
      themeDetails: themeObj.colors
    };
    const response: ICommEvent<IThemeResponse> = {
      app: 'WEB_PORTAL',
      type: 'THEME_RESPONSE',
      state: 'NONE',
      plugin: 'NONE',
      data: {
        id: 'theme_' + this.utilitySvc.randomId,
        theme: themeData
      }
    };
    window.postMessage(response, '*');
    this.mobileSvc.sendTheme(themeData);
  }

  public setPageTheme(themeName: string) {
    this.updateTheme(themeName, false);
  }
  public resetPageTheme() {
    this.updateTheme(this.preferences[KEY_SELECTED_THEME], false);
  }
  public updateTheme(themeName: string, save = true) {
    const themeObj = this.configSvc.instanceConfig.features.settings.config.themes.find(u => u.name === themeName);
    if (!themeObj) {
      const defaultTheme = this.configSvc.instanceConfig.platform.defaultTheme;
      const themeNameToSet =
        themeName !== defaultTheme
          ? defaultTheme
          : this.configSvc.instanceConfig.features.settings.config.themes[0].name;
      this.updateTheme(themeNameToSet, save);
      return;
    }
    this.themeObject$.next(themeObj);
    if (save && themeName !== null) {
      this._updateIndividualPreference(KEY_SELECTED_THEME, themeName).subscribe(_ => {
        // this.notifyThemeChange();
      });
    }
    this.notifyThemeChange();
    this.updateHtmlMetaAndClass();
  }
  public updateFont(font: TValidFonts, save = true) {
    if (!this.configSvc.instanceConfig.features.settings.config.fonts.some(u => u === font)) {
      const defaultFont = this.configSvc.instanceConfig.platform.defaultFont;
      const nextFont =
        font !== defaultFont ? defaultFont : this.configSvc.instanceConfig.features.settings.config.fonts[0];
      this.updateFont(nextFont, save);
      return;
    }
    (this.font$ as BehaviorSubject<string>).next(font);
    if (save && font !== null) {
      this._updateIndividualPreference(KEY_SELECTED_FONT, font).subscribe();
    }
    this.updateHtmlMetaAndClass();
  }
  public updateLanguage(languageCode: string, langUpdateMessage: string, save = true) {
    // console.log('languageCode >', languageCode);
    if (
      !this.configSvc.instanceConfig.features.settings.config.language.some(
        u => u.code === languageCode || (u.code === 'en' && languageCode === '')
      )
    ) {
      logger.warn('INVALID Language code selected', languageCode);
      return;
    }
    (this.language$ as BehaviorSubject<string>).next(languageCode);
    if (save && languageCode !== null) {
      this.showLangMessage(languageCode, langUpdateMessage);
      this._updateIndividualPreference(KEY_SELECTED_LANGUAGE, languageCode).subscribe();
      return;
    } else if (languageCode !== null) {
      this._updateUrlForLang(languageCode);
    }
    // this.updateHtmlMetaAndClass();
  }
  private _updateUrlForLang(newLangCode: string) {
    const langCode = this._getLangCodeFromUrl();
    // console.log('langCode >', langCode);
    // console.log('newLangCode >', newLangCode);
    if (langCode !== newLangCode) {
      const pathUrl = location.pathname;
      const firstSlash = pathUrl.indexOf('/') + 1;
      const secondSlash = pathUrl.indexOf('/', firstSlash);

      const appPathWithoutLang = langCode === '' ? pathUrl : pathUrl.substring(secondSlash);
      const appPathWithNewLang = newLangCode === '' ? appPathWithoutLang : `/${newLangCode}${appPathWithoutLang}`;
      const langObj = this.configSvc.instanceConfig.features.settings.config.language.find(u => u.code === newLangCode);
      if (!langObj.isSupported) {
        this._updateIndividualPreference(KEY_SELECTED_LANGUAGE, '').subscribe(_ => {
          this._navigate(appPathWithoutLang);
        });
      } else {
        this._navigate(appPathWithNewLang);
      }
    } else {
      // console.log('LANG IS SET');
    }
  }
  private _getLangCodeFromUrl() {
    const pathUrl = location.pathname;
    const firstSlash = pathUrl.indexOf('/') + 1;
    const secondSlash = pathUrl.indexOf('/', firstSlash);
    const langCode = pathUrl.substring(firstSlash, secondSlash > -1 ? secondSlash : firstSlash);
    const langObj = this.configSvc.instanceConfig.features.settings.config.language.find(u => u.code === langCode);
    return langObj && langObj.isSupported ? langObj.code : '';
  }
  private setInitialPreferences() {
    this.preferences = {
      selectedTheme: localStorage.getItem(KEY_SELECTED_THEME) || this.configSvc.instanceConfig.platform.defaultTheme,
      selectedFont: localStorage.getItem(KEY_SELECTED_FONT) || this.configSvc.instanceConfig.platform.defaultFont,
      // selectedLanguage:
      //   localStorage.getItem(KEY_SELECTED_LANGUAGE) || this.configSvc.instanceConfig.platform.defaultLanguage
      selectedLanguage: this.configSvc.instanceConfig.platform.defaultLanguage
    };
    this.updateFont(this.preferences[KEY_SELECTED_FONT], false);
    this.updateTheme(this.preferences[KEY_SELECTED_THEME], false);
    // if (localStorage.getItem(KEY_SELECTED_LANGUAGE)) {
    //   this.updateLanguage(this.preferences[KEY_SELECTED_LANGUAGE], localStorage.getItem(KEY_SELECTED_LANGUAGE), false);
    // }
    this.authSvc.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        let preferences = this.userSvc.pref;
        if (!preferences) {
          preferences = {};
        }
        this.preferences = {
          selectedTheme:
            preferences[KEY_SELECTED_THEME] ||
            localStorage.getItem(KEY_SELECTED_THEME) ||
            this.configSvc.instanceConfig.platform.defaultTheme,
          selectedFont:
            preferences[KEY_SELECTED_FONT] ||
            localStorage.getItem(KEY_SELECTED_FONT) ||
            this.configSvc.instanceConfig.platform.defaultFont,
          selectedLanguage:
            preferences[KEY_SELECTED_LANGUAGE] ||
            localStorage.getItem(KEY_SELECTED_LANGUAGE) ||
            this.configSvc.instanceConfig.platform.defaultLanguage
        };
        if (preferences[KEY_SELECTED_LANGUAGE] === '') {
          this.preferences[KEY_SELECTED_LANGUAGE] = '';
        }
        // console.log('this.preferences.selectLang >', this.preferences.selectedLanguage);
        // this.notifyThemeChange();
        this._updateAllPreferences();
      }
    });
  }
  private _updateAllPreferences() {
    this.updateFont(this.preferences[KEY_SELECTED_FONT], false);
    this.updateTheme(this.preferences[KEY_SELECTED_THEME], false);
    this.updateLanguage(this.preferences[KEY_SELECTED_LANGUAGE], '', false);
    return this.userSvc.updateUserPreference(this.preferences);
  }
  private _updateIndividualPreference(key: string, value: any): Observable<any> {
    this.preferences[key] = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, value);
    return this.userSvc.updateUserPreference(this.preferences);
  }

  private showLangMessage(languageCode: string, langUpdateMessage: string) {
    const duration = 3000;
    if (langUpdateMessage && langUpdateMessage.length) {
      this.openSnackBar(langUpdateMessage, duration);
      setTimeout(() => {
        this._updateUrlForLang(languageCode);
      }, duration);
    } else {
      this._updateUrlForLang(languageCode);
    }
  }

  private async updateHtmlMetaAndClass() {
    try {
      const themeObj = await this.theme$.pipe(take(1)).toPromise();
      let fontName = await this.font$.pipe(take(1)).toPromise();
      fontName = fontName || this.configSvc.instanceConfig.platform.defaultFont;
      const toRemove = this.configSvc.instanceConfig.features.settings.config.themes
        .map(u => u.className)
        .concat(this.configSvc.instanceConfig.features.settings.config.fonts)
        .filter(u => u.length > 0);
      document.body.classList.remove(...toRemove);
      const toAdd = [];
      if (themeObj.className) {
        toAdd.push(themeObj.className);
        this.updateIndexHTMLMeta(themeObj);
      }
      if (fontName.length > 0) {
        toAdd.push(fontName);
      }
      if (toAdd.length > 0) {
        document.body.classList.add(...toAdd);
      }
    } catch (err) {
      logger.error(err);
    }
  }

  private updateIndexHTMLMeta(themeObj: IInstanceTheme) {
    try {
      (document.getElementById(
        'id-instance-open-search'
      ) as HTMLLinkElement).href = this.configSvc.instanceConfig.platform.indexHtmlMeta.openSearchUrl;
      (document.getElementById(
        'id-instance-open-search'
      ) as HTMLLinkElement).title = this.configSvc.instanceConfig.platform.appName;
    } catch (error) {}
    try {
      (document.getElementById('id-instance-theme-color-meta') as HTMLMetaElement).content = themeObj.colors.primary;
    } catch (error) {}
    try {
      (document.getElementById(
        'id-instance-apple-touch-icon-57'
      ) as HTMLLinkElement).href = this.configSvc.instanceConfig.platform.indexHtmlMeta.appleTouchIcon57;
    } catch (error) {}
    try {
      (document.getElementById(
        'id-instance-apple-touch-icon-180'
      ) as HTMLLinkElement).href = this.configSvc.instanceConfig.platform.indexHtmlMeta.appleTouchIcon180;
    } catch (error) {}
    try {
      (document.getElementById(
        'id-instance-icon-32'
      ) as HTMLLinkElement).href = this.configSvc.instanceConfig.platform.indexHtmlMeta.icon32;
    } catch (error) {}
    try {
      (document.getElementById(
        'id-instance-icon-16'
      ) as HTMLLinkElement).href = this.configSvc.instanceConfig.platform.indexHtmlMeta.icon16;
    } catch (error) {}
    try {
      (document.getElementById(
        'id-instance-webmanifest'
      ) as HTMLLinkElement).href = this.configSvc.instanceConfig.platform.indexHtmlMeta.webmanifest;
    } catch (error) {}
    try {
      (document.getElementById(
        'id-instance-mask-icon'
      ) as HTMLLinkElement).href = this.configSvc.instanceConfig.platform.indexHtmlMeta.maskIcon;
    } catch (error) {}
    try {
      (document.getElementById(
        'id-instance-x-icon'
      ) as HTMLLinkElement).href = this.configSvc.instanceConfig.platform.indexHtmlMeta.xIcon;
    } catch (error) {}
  }

  public getBrowserInfo() {
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return { name: 'IE', version: tem[1] || '' };
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\bOPR\/(\d+)/);
      if (tem != null) {
        return { name: 'Opera', version: tem[1] };
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }
    return {
      name: M[0],
      version: M[1]
    };
  }

  private openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {
      duration
    });
  }

  private _navigate(path: string) {
    if (path !== location.pathname) {
      // console.log('redirecting to path', path);
      window.location.assign(path);
    }
  }
}
