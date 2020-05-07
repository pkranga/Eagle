/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JsonpModule } from '@angular/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { ServiceWorkerModule } from '@angular/service-worker';
import { KeycloakAngularModule } from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppUnavailableComponent } from './components/app-unavailable/app-unavailable.component';
import { AppsComponent } from './components/apps/apps.component';
import { BannerWithContentStripModule } from './modules/banner-with-content-strip/banner-with-content-strip.module';
// import { BannerWithContentStripsComponent } from './components/banner-with-content-strips/banner-with-content-strips.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { DialogIntranetInfoComponent } from './components/dialog-intranet-info/dialog-intranet-info.component';
import { LoginNavBarComponent } from './components/login-nav-bar/login-nav-bar.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutConfirmComponent } from './components/logout-confirm/logout-confirm.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RootComponent } from './components/root/root.component';
import { ShortcutComponentComponent } from './components/shortcut-component/shortcut-component.component';
import { UnavailableWarningComponent } from './components/unavailable-warning/unavailable-warning.component';
import { CustomDirectivesModule } from './directives/custom-directives.module';
import { CarouselModule } from './modules/carousel/carousel.module';
import { CommonMaterialModule } from './modules/common-material/common-material.module';
import { SearchStripModule } from './modules/search-strip/search-strip.module';
// services and logger
import { InitService } from './services/init.service';
import logger from './utils/logger';

const appInitializer = (initSvc: InitService) => async () => {
  try {
    await initSvc.init();
    // logger.info('Initialization of app done.');
  } catch (error) {
    logger.error('Error while initializing app >', error);
  }
};

@NgModule({
  declarations: [
    RootComponent,
    NavBarComponent,
    LoginNavBarComponent,
    AppsComponent,
    LoginComponent,
    LogoutConfirmComponent,
    ShortcutComponentComponent,
    ChatbotComponent,
    UnavailableWarningComponent,
    DialogIntranetInfoComponent,
    AppUnavailableComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    JsonpModule,
    BannerWithContentStripModule,
    // ServiceWorkerModule.register('ngsw-worker.js', {
    //   enabled: environment.production
    // }),
    KeycloakAngularModule,
    CommonMaterialModule,
    CustomDirectivesModule,
    CarouselModule,
    SearchStripModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [InitService],
      multi: true
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: { duration: 3000 }
    }
  ],
  bootstrap: [RootComponent],
  entryComponents: [
    LogoutConfirmComponent,
    ShortcutComponentComponent,
    UnavailableWarningComponent,
    DialogIntranetInfoComponent
  ],
  exports: [BannerWithContentStripModule]
})
export class AppModule {}
