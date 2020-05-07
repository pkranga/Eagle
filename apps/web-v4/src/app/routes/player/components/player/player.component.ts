/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { MiscService } from '../../../../services/misc.service';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { IDataResponse, TDataError } from '../../../../models/comm-events.model';
import { IContent } from '../../../../models/content.model';
import { IViewerResolve } from '../../../../resolvers/viewer.resolve';
import { ConfigService } from '../../../../services/config.service';
import { MobileAppsService } from '../../../../services/mobile-apps.service';
import { PlayerDataService } from '../../../../services/player-data.service';
import { RoutingService } from '../../../../services/routing.service';
import { TelemetryService } from '../../../../services/telemetry.service';
import { UtilityService } from '../../../../services/utility.service';
import { ValuesService } from '../../../../services/values.service';
import { IProcessedViewerContent, ViewerService } from '../../../../services/viewer.service';
import { TextModalComponent } from '../../../viewer/components/text-modal/text-modal.component';

@Component({
  selector: 'ws-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit, OnDestroy {
  @ViewChild('toastWebinar', { static: true }) toastWebinar: ElementRef<any>;
  @ViewChild('toastWebinarTitle', { static: true }) toastWebinarTitle: ElementRef<any>;
  @ViewChild('toastIosExternalContent', { static: true }) toastIos: ElementRef<any>;
  @ViewChild('viewerContent', { static: true }) viewerContentRef: ElementRef<HTMLDivElement>;
  sideNavBarOpened = true;
  private isLtMedium$ = this.valueSvc.isLtMedium$;
  private isLtMedium = false;
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
  pluginType: 'content' | 'blogs';
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private viewerSvc: ViewerService,
    private utilSvc: UtilityService,
    private valueSvc: ValuesService,
    public routingSvc: RoutingService,
    private telemetrySvc: TelemetryService,
    private mobileAppSvc: MobileAppsService,
    private miscSvc: MiscService,
    private configSvc: ConfigService,
    private playerDataSvc: PlayerDataService
  ) {}
  MIME_TYPE_MAP = {
    'application/vnd.ekstep.content-collection': 'collection',
    'application/html': 'html',
    'application/ilpfp': 'ilp-fp',
    'application/iap-assessment': 'iap',
    'audio/mpeg': 'audio',
    'video/mp4': 'video',
    'application/x-mpegURL': 'videojs',
    'video/interactive': 'interactive-video',
    'application/pdf': 'pdf',
    'application/quiz': 'quiz',
    'application/drag-drop': 'dnd-quiz',
    'application/htmlpicker': 'html-picker',
    'application/web-module': 'web-module',
    'video/x-youtube': 'youtube',
    'application/integrated-hands-on': 'hands-on',
    'application/class-diagram': 'class-diagram',
    'resource/collection': 'collection',
    // Added on UI Only
    'application/certification': 'certification'
  };
  ngOnInit() {
    this.miscSvc.navBarDisplaySubject.next(false);
    this.paramSubscription = this.activatedRoute.data.subscribe(
      async data => {
        const delayer = timer(100)
          .pipe(take(1))
          .toPromise();
        this.reset();
        this.pluginType = data.playerDetails.type;
        if (this.pluginType === 'content') {
          const viewerDetails: IViewerResolve = data.playerDetails;
          if (!viewerDetails.content && !viewerDetails.toc) {
            this.loadStatus = 'NO_CONTENT';
            return;
          }
          this.resource = viewerDetails.content;
          if (this.resource && this.resource.learningMode === 'Instructor-Led') {
            this.loadStatus = 'INSTRUCTOR_LED';
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
          if (this.MIME_TYPE_MAP[data.playerDetails.content.mimeType]) {
            this.router.navigate([this.MIME_TYPE_MAP[data.playerDetails.content.mimeType]], {
              relativeTo: this.activatedRoute
            });
          } else {
            this.router.navigate(['error'], {
              relativeTo: this.activatedRoute
            });
          }
          this.viewerSvc.updateViewCountAndHistoryOnLoad(
            this.toc ? this.toc.identifier : null,
            viewerDetails.content.identifier
          );
        }
        // else if (this.pluginType === 'blogs') {
        //   console.log('send to blog');
        // } else if (this.pluginType === 'qAndA') {
        //   console.log('send to q-and-a');
        // } else if (this.pluginType === 'goals') {
        //   console.log('send to goals');
        // } else if (this.pluginType === 'playlists') {
        //   console.log('send to playlists');
        // } else if (this.pluginType === 'khub') {
        //   console.log('send to khub');
        // }
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
    this.playerDataSvc.data.processedResource = this.processedResource;
    if (
      this.valueSvc.getBrowserInfo().name.toLowerCase() === 'safari' &&
      (this.resource.sourceName.toLowerCase() === 'facenxt' || this.resource.sourceName.toLowerCase() === 'upgrad')
    ) {
      this.dialog.open(TextModalComponent, {
        data: {
          message: this.toastIos.nativeElement.value
        }
      });
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

  slide(dir: 'left' | 'right') {
    if (dir === 'left') {
      this.router.navigate([this.prevResourceUrl]);
    } else if (dir === 'right') {
      this.router.navigate([this.nextResourceUrl]);
    }
  }
}
