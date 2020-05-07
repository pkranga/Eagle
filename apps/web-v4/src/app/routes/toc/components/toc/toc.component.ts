/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidAssessmentResources, ValidPracticeResources } from '../../../../constants/content.constants';
import { EUserRoles } from '../../../../constants/enums.constant';
import { IContent, IHistory, TFilterCategory } from '../../../../models/content.model';
import { ResolveResponse } from '../../../../models/routeResolver.model';
import { FetchStatus } from '../../../../models/status.model';

import { AuthService } from '../../../../services/auth.service';
import { MobileAppsService } from '../../../../services/mobile-apps.service';
import { UserService } from '../../../../services/user.service';
import { AccessControlService } from '../../../../services/access-control.service';
import { ConfigService } from '../../../../services/config.service';
import { HistoryService } from '../../../../services/history.service';
import { RoutingService } from '../../../../services/routing.service';
import { TrainingsService } from '../../../../services/trainings.service';
import { UtilityService } from '../../../../services/utility.service';
import { ValuesService } from '../../../../services/values.service';
import { TocService } from '../../services/toc.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { DialogAmpComponent } from '../../../../modules/dialog-amp-video/components/dialog-amp/dialog-amp.component';
import { MIME_TYPE } from '../../../../constants/mime.constants';
import { TrainingsApiService } from '../../../../apis/trainings-api.service';
import { IInstanceConfig } from '../../../../models/instanceConfig.model';

@Component({
  selector: 'ws-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.scss']
})
export class TocComponent implements OnInit, OnDestroy {
  bannerUrl: SafeStyle;
  firstContentUrl: string;
  tocResponse: ResolveResponse<IContent> = this.route.snapshot.data.tocContent;
  content: IContent;
  contentProgress: number;
  resumeData: IHistory;
  resumeDataFetchStatus: FetchStatus;
  errorMessageCode: 'API_FAILURE' | 'NO_DATA' | 'INVALID_DATA';
  readonly mimeType = MIME_TYPE;

  sideNavBarOpened = true;
  isLtMedium$ = this.valueSvc.isLtMedium$;
  isAssessVisible = false;
  isPracticeVisible = false;
  enableDiscussionForum = false;
  private defaultSideNavBarOpenedSubscription: Subscription;
  mode$ = this.isLtMedium$.pipe(map(isLtMedium => (isLtMedium ? 'over' : 'side')));
  canShowTocAction = true;
  siemensAvailable = this.configSvc.instanceConfig.features.siemens.enabled;
  tocSubFeatures = this.configSvc.instanceConfig.features.toc.subFeatures;
  lhubCertificationsAvailable = this.configSvc.instanceConfig.features.certificationsLHub.available;
  isValidTrainingContent: boolean;
  instanceConfig: IInstanceConfig = this.configSvc.instanceConfig;

  currentTab: string;
  tabs = [
    'about',
    'certification',
    'training',
    'content',
    'analytics',
    'instructions',
    'cohorts',
    'projects',
    'discussion',
    'post-learn',
    'part-of',
    'materials'
  ];
  paramSubscription: Subscription;

  userRoles = new Set<string>();
  ROLES = EUserRoles;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    public snackBar: MatSnackBar,
    public routingSvc: RoutingService,
    private valueSvc: ValuesService,
    private historySvc: HistoryService,
    private accessControlSvc: AccessControlService,
    private tocSvc: TocService,
    private utilSvc: UtilityService,
    private userSvc: UserService,
    private mobileAppSvc: MobileAppsService,
    private authSvc: AuthService,
    private configSvc: ConfigService,
    private trainingsSvc: TrainingsService,
    private trainingApi: TrainingsApiService
  ) {}

  ngOnInit() {
    this.bannerUrl = this.sanitizer.bypassSecurityTrustStyle(
      `url(${this.configSvc.instanceConfig.features.toc.config.bannerUrl})`
    );
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe(isXSmall => {
      this.sideNavBarOpened = !isXSmall;
    });
    this.verifyContent();
    this.loadTabAndVerifyContent();
  }

  ngOnDestroy() {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe();
    }
  }

  private verifyContent() {
    this.tocResponse = this.route.snapshot.data.tocContent;
    if (!this.tocResponse.error) {
      this.content = this.tocResponse.data;
      if (this.content) {
        if (this.content.introductoryVideo && this.content.introductoryVideoIcon) {
          this.bannerUrl = this.sanitizer.bypassSecurityTrustStyle(`url(${this.content.introductoryVideoIcon})`);
        }
        this.checkIfShowTocAction();
        this.userSvc.getProgressFor(this.content.identifier).subscribe(progress => {
          this.contentProgress = progress || 0;
        });
        this.errorMessageCode = undefined;
        this.isPracticeVisible = Boolean(this.filterToc(this.content, 'practice'));
        this.isAssessVisible = Boolean(this.filterToc(this.content, 'assess'));

        const firstContentId = this.tocSvc.getFirstChildInHierarchy(this.content).identifier;

        if (firstContentId === this.content.identifier) {
          this.firstContentUrl = '/viewer/' + this.content.identifier;
        } else {
          this.firstContentUrl = '/viewer/' + this.content.identifier + '/' + firstContentId;
        }

        if (!this.content.trainings) {
          this.getTrainings();
        }

        this.isValidTrainingContent = this.trainingsSvc.isValidTrainingContent(this.content);

        if (this.resumeDataFetchStatus !== 'done') {
          this.getContinueLearningData(this.content.identifier);
        }
        this.getUserRoles();
        if (this.tocSubFeatures.discussionForum.enabled) {
          if (this.tocSubFeatures.discussionForum.config.yammer) {
            const validEmailExtensionsForOfficeLogin = this.configSvc.preLoginConfig.validEmailExtensionsForOfficeLogin;
            if (Array.isArray(validEmailExtensionsForOfficeLogin) && validEmailExtensionsForOfficeLogin.length) {
              this.enableDiscussionForum = validEmailExtensionsForOfficeLogin.some(u =>
                this.authSvc.userEmail.endsWith(u)
              );
            }
          } else {
            this.enableDiscussionForum = true;
          }
        }
        // const validEmailExtensionsForOfficeLogin = this.configSvc.preLoginConfig.validEmailExtensionsForOfficeLogin;
        // if (Array.isArray(validEmailExtensionsForOfficeLogin) && validEmailExtensionsForOfficeLogin.length) {
        //   this.enableDiscussionForum =
        //     this.tocSubFeatures.discussionForum.enabled &&
        //     ((this.tocSubFeatures.discussionForum.config.yammer &&
        //       validEmailExtensionsForOfficeLogin.some(u => this.authSvc.userEmail.endsWith(u))) ||
        //       this.tocSubFeatures.discussionForum.config.discussionForum);
        // }
      } else {
        this.errorMessageCode = 'NO_DATA';
      }
    } else {
      this.errorMessageCode = 'API_FAILURE';
    }
  }

  private loadTabAndVerifyContent() {
    if (this.content) {
      this.paramSubscription = this.route.paramMap.subscribe(params => {
        this.currentTab = params.get('tab');
        const identifier = params.get('contentId');
        if (identifier !== this.content.identifier) {
          this.verifyContent();
        }
        if (this.tabs.indexOf(this.currentTab) === -1) {
          this.router.navigate(['toc', this.content.identifier, 'about']);
        } else if (!this.content.children.length && this.currentTab === 'content') {
          this.router.navigate(['toc', this.content.identifier, 'about']);
        }
      });
    }
  }

  private checkIfShowTocAction() {
    if (this.content.isExternalCourse) {
      this.canShowTocAction = false;
      return;
    }
    if (this.content.learningMode === 'Instructor-Led') {
      if (
        this.content.contentType === 'Learning Path' ||
        (this.content.mimeType === this.mimeType.collection && !this.content.children.length)
      ) {
        this.canShowTocAction = false;
      }
    }
    if (
      this.content.contentType === 'Learning Path' &&
      (this.content.children || []).every(child => child.learningMode === 'Instructor-Led')
    ) {
      this.canShowTocAction = false;
    }
  }

  playIntroVideo() {
    this.dialog.open(DialogAmpComponent, {
      data: this.content,
      height: '400px',
      width: '600px'
    });
  }

  navigateIfAvailable(event: Event, featureName: string) {
    if (
      !this.configSvc.instanceConfig.features[featureName] &&
      this.configSvc.instanceConfig.features[featureName].available
    ) {
      event.preventDefault();
      this.utilSvc.featureUnavailable();
    }
  }

  private getUserRoles() {
    this.accessControlSvc.getUserRoles().subscribe(data => {
      this.userRoles = data;
    });
  }

  private getContinueLearningData(contentId: string) {
    this.resumeDataFetchStatus = 'fetching';
    this.resumeData = undefined;
    this.historySvc.fetchContentContinueLearning(contentId).subscribe(
      data => {
        if (data && data.results) {
          data.results = data.results || [];
          if (
            data.results.length &&
            data.results[0].continueLearningData &&
            data.results[0].continueLearningData.resourceId
          ) {
            this.resumeData = data.results[0];
          }
        }
        this.resumeDataFetchStatus = 'done';
      },
      err => {
        this.resumeDataFetchStatus = 'done';
      }
    );
  }

  toggleSidenavOnLtMedium() {
    this.isLtMedium$.subscribe(isLtMedium => {
      if (isLtMedium) {
        this.sideNavBarOpened = !this.sideNavBarOpened;
      }
    });
  }

  filterToc(content: IContent, filterCategory: TFilterCategory | string = 'all'): IContent {
    if (content.contentType === 'Resource' || content.contentType === 'Knowledge Artifact') {
      return this.filterUnitContent(content, filterCategory) ? content : null;
    } else {
      const filteredChildren = content.children
        .map(unitContent => this.filterToc(unitContent, filterCategory))
        .filter(unitContent => Boolean(unitContent));
      if (filteredChildren.length) {
        return {
          ...content,
          children: filteredChildren
        };
      }
      return null;
    }
  }

  filterUnitContent(content: IContent, filterCategory: TFilterCategory | string = 'all'): boolean {
    switch (filterCategory) {
      case 'all':
        return true;
      case 'learn':
        return !ValidPracticeResources.has(content.resourceType) && !ValidAssessmentResources.has(content.resourceType);
      case 'practice':
        return ValidPracticeResources.has(content.resourceType);
      case 'assess':
        return ValidAssessmentResources.has(content.resourceType);
      default:
        return true;
    }
  }
  durationInfo(message) {
    this.snackBar.open(message);
  }
  sendTocDataToMobile() {
    this.mobileAppSvc.sendViewerData(this.content);
  }

  getTrainings() {
    // FOR SIEMENS DEMO
    if (this.configSvc.instanceConfig.features.siemens.enabled) {
      this.trainingApi.getProgramTrainings(this.content.identifier).subscribe(training => {
        this.content.trainingProgram = training;
      });
    } else {
      this.trainingsSvc.getTrainings(this.content).subscribe(trainings => {
        this.content.trainings = trainings;
      });
    }
  }
}
