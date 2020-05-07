/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MiscService } from '../../../../services/misc.service';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { IDataResponse, TDataError } from '../../../../models/comm-events.model';
import { IContent } from '../../../../models/content.model';
import { IViewerResolve } from '../../../../resolvers/viewer.resolve';
import { ConfigService } from '../../../../services/config.service';
import { MobileAppsService } from '../../../../services/mobile-apps.service';
import { RoutingService } from '../../../../services/routing.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { UtilityService } from '../../../../services/utility.service';
import { ValuesService } from '../../../../services/values.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
import { TextModalComponent } from '../text-modal/text-modal.component';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {
  @ViewChild('toastWebinar', { static: true }) toastWebinar: ElementRef<any>;
  @ViewChild('toastWebinarTitle', { static: true }) toastWebinarTitle: ElementRef<any>;
  @ViewChild('toastIosExternalContent', { static: true }) toastIos: ElementRef<any>;
  @ViewChild('viewerContent', { static: true }) viewerContentRef: ElementRef<HTMLDivElement>;
  @ViewChild('scrollableContent', { static: true }) scrollableContentRef: ElementRef<any>; // Required for Drag-and-Drop plugin
  sideNavBarOpened = true;
  private isLtMedium$ = this.valueSvc.isLtMedium$;
  public isLtMedium = false;
  mode$ = this.isLtMedium$.pipe(map(isSmall => (isSmall ? 'over' : 'side')));
  readonly mimeType = MIME_TYPE;
  private paramSubscription: Subscription;
  private queryParamsSubscription: Subscription;
  private isSmallSubscription: Subscription;
  private defaultSideNavBarOpenedSubscription: Subscription;
  hasCollection = false;
  partOfCollectionCount = 0;
  toc: IContent = null;
  resource: IContent = null;
  processedResource: IProcessedViewerContent = null;
  flatToc: IContent[] = [];
  currentResourceIndex = -1;
  showRecommendations = false;
  navConfig = {
    name: this.configSvc.instanceConfig.platform.appName,
    logo: this.configSvc.instanceConfig.platform.logo
  };
  loadStatus: 'LOADING' | 'LOADED' | 'RESOURCE_NOT_IN_COLLECTION' | 'INSTRUCTOR_LED' | 'EXTERNAL_COURSE' | TDataError =
    'LOADING';
  showBackground = this.configSvc.instanceConfig.platform.showIconBackground;
  constructor(
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private viewerSvc: ViewerService,
    private utilSvc: UtilityService,
    private valueSvc: ValuesService,
    public routingSvc: RoutingService,
    private telemetrySvc: TelemetryService,
    private mobileAppSvc: MobileAppsService,
    private miscSvc: MiscService,
    private configSvc: ConfigService
  ) { }

  ngOnInit() {
    this.miscSvc.navBarDisplaySubject.next(false);
    this.paramSubscription = this.activatedRoute.data.subscribe(
      async data => {
        const delayer = timer(100)
          .pipe(take(1))
          .toPromise();
        this.reset();
        const viewerDetails: IViewerResolve = data.viewerDetails;
        if (!viewerDetails.content && !viewerDetails.toc) {
          this.loadStatus = 'NO_CONTENT';
          return;
        }
        this.resource = viewerDetails.content;
        // if (this.resource && this.resource.learningMode === 'Instructor-Led') {
        //   this.loadStatus = 'INSTRUCTOR_LED';
        //   return;
        // }
        if (this.toc && this.toc.learningMode === 'Instructor-Led' && !this.toc.children.length) {
          this.loadStatus = 'INSTRUCTOR_LED';
          return;
        }
        if (this.resource && this.resource.isExternalCourse) {
          this.loadStatus = 'EXTERNAL_COURSE';
          window.open(this.resource.artifactUrl);
        }
        this.toc = viewerDetails.toc;
        this.hasCollection = this.toc !== null && this.toc.identifier !== this.resource.identifier;
        this.flatToc = this.hasCollection ? this.utilSvc.getLeafNodes(this.toc, []) : [];
        this.currentResourceIndex = this.flatToc.findIndex(c => c.identifier === this.resource.identifier);
        await delayer;
        this.updateProcessedContent(viewerDetails.content.identifier);
        this.viewerSvc.updateViewCountAndHistoryOnLoad(
          this.toc ? this.toc.identifier : null,
          viewerDetails.content.identifier
        );
        this.loadStatus = 'LOADED';
      },
      () => {
        this.loadStatus = 'UNKNOWN_ERROR';
      }
    );

    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isSmall => {
      this.isLtMedium = isSmall;
      this.sideNavBarOpened = !isSmall;
    });
  }

  toggleSideBar() {
    this.sideNavBarOpened = !this.sideNavBarOpened;
  }

  closeToC() {
    if (this.isLtMedium) {
      this.closeSidenav();
    }
  }
  closeSidenav() {
    this.sideNavBarOpened = false;
  }
  reset() {
    this.partOfCollectionCount = 0;
    this.hasCollection = false;
    this.toc = null;
    this.resource = null;
    this.processedResource = null;
    this.flatToc = [];
    this.loadStatus = 'LOADING';
    this.currentResourceIndex = -1;
    this.showRecommendations = false;
  }

  ngOnDestroy() {
    this.miscSvc.navBarDisplaySubject.next(true);
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
    if (this.isSmallSubscription) {
      this.paramSubscription.unsubscribe();
    }
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe();
    }
    this.telemetrySvc.lastEvent = null;
  }

  get prevResourceUrl(): string {
    if (this.currentResourceIndex > 0) {
      return (
        '/viewer' +
        (this.hasCollection ? `/${this.toc.identifier}/` : '/') +
        this.flatToc[this.currentResourceIndex + -1].identifier
      );
    }
    return null;
  }
  get nextResourceUrl(): string {
    if (this.currentResourceIndex >= 0 && this.currentResourceIndex < this.flatToc.length - 1) {
      return (
        '/viewer' +
        (this.hasCollection ? `/${this.toc.identifier}/` : '/') +
        this.flatToc[this.currentResourceIndex + 1].identifier
      );
    }
    return null;
  }
  get nextResource(): IContent {
    if (this.currentResourceIndex >= 0 && this.currentResourceIndex < this.flatToc.length - 1) {
      return this.flatToc[this.currentResourceIndex + 1];
    }
    return null;
  }

  private async updateProcessedContent(resourceId: string) {
    const dataResponse: IDataResponse<IProcessedViewerContent> = await this.viewerSvc.processResponse({
      id: `viewer_${resourceId}`,
      contentId: resourceId
    });
    if (dataResponse.error) {
      this.loadStatus = dataResponse.error;
    }
    this.processedResource = dataResponse.data;
    if (
      this.valueSvc.getBrowserInfo().name.toLowerCase() === 'safari' &&
      (this.resource.sourceName.toLowerCase() === 'facenxt' || this.resource.sourceName.toLowerCase() === 'upgrad')
    ) {
      this.dialog.open(TextModalComponent, {
        data: {
          message: this.toastIos.nativeElement.value
        }
      });
      // setTimeout(() => {
      //   this.dialog.closeAll();
      // }, 6000);
    }
    if (this.resource.resourceType === 'Webinar Recording') {
      this.dialog.open(TextModalComponent, {
        data: {
          title: this.toastWebinarTitle.nativeElement.value,
          message: this.toastWebinar.nativeElement.value
        }
      });
      setTimeout(() => {
        this.dialog.closeAll();
      }, 20000);
    }
    this.mobileAppSvc.sendViewerData(this.resource);
  }

  displayRecommendations() {
    this.showRecommendations = true;
  }
}
