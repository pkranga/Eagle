/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, Input } from '@angular/core';
import { ValuesService } from '../../services/values.service';
import { MatSliderChange, MatDialog } from '@angular/material';
import { map } from 'rxjs/operators';
import { ShortcutComponentComponent } from '../shortcut-component/shortcut-component.component';
import { ConfigService } from '../../services/config.service';
import { AuthService } from '../../services/auth.service';
import { UtilityService } from '../../services/utility.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  @Input()
  navbarPosition: 'top' | 'bottom' = 'top';
  bottomFeatures = this.configSvc.instanceConfig.platform.navBottomFeatures;
  searchDirector = this.configSvc.instanceConfig.externalLinks.searchValue || 'search';
  navConfig = {
    name: this.configSvc.instanceConfig.platform.appName,
    logo: this.configSvc.instanceConfig.platform.logo
  };
  showBackground = false;
  settingsSubFeatures = this.configSvc.instanceConfig.features.settings.subFeatures;
  selectedTheme = '';
  selectedLanguage = '';
  fontNames = this.configSvc.instanceConfig.features.settings.config.fonts;
  languageConfig = this.configSvc.instanceConfig.features.settings.config.language;
  themeConfig = this.configSvc.instanceConfig.features.settings.config.themes;
  fontSliderValue$ = this.valuesSvc.font$.pipe(
    map(fontName => this.fontNames.indexOf(fontName)),
    map(index => (index === -1 ? 1 : index))
  );
  // @ViewChild('searchQuery') searchQueryElement: ElementRef;

  constructor(
    private authSvc: AuthService,
    private utilSvc: UtilityService,
    public dialog: MatDialog,
    private valuesSvc: ValuesService,
    private configSvc: ConfigService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (this.configSvc.instanceConfig.features.siemens.enabled) {
      const userEmail = this.authSvc.userEmail;
      this.utilSvc.getDataFromUrl('/assets/hardcodings/home-redirection.json').subscribe(userData => {
        if (userData[userEmail] && userData[userEmail].logo) {
          this.navConfig.logo = userData[userEmail].logo;
          this.showBackground = userData[userEmail].showBackground;
        }
      });
    } else {
      this.showBackground = this.configSvc.instanceConfig.platform.showIconBackground;
    }
    this.valuesSvc.theme$.subscribe(themeObj => {
      this.selectedTheme = themeObj.name;
    });
    this.valuesSvc.language$.subscribe(language => {
      this.selectedLanguage = language;
    });
  }

  changeTheme(themeName: string) {
    this.valuesSvc.updateTheme(themeName);
  }
  changeFont(slider: MatSliderChange) {
    this.valuesSvc.updateFont(this.fontNames[slider.value] || this.fontNames[1]);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ShortcutComponentComponent, {
      width: 'auto'
    });

    dialogRef.afterClosed().subscribe(() => {});
  }

  changeLanguage(langCode: string) {
    this.valuesSvc.updateLanguage(langCode, (document.getElementById('lang-change') as HTMLInputElement).value);
  }
}
