/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { startWith, debounceTime } from 'rxjs/operators';
import { RoutingService } from '../../services/routing.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MobileAppsService } from '../../services/mobile-apps.service';
import { EUserRoles } from '../../constants/enums.constant';
import { UtilityService } from '../../services/utility.service';
import { ConfigService } from '../../services/config.service';
import { UserService } from '../../services/user.service';
import { IExternalUrl } from '../../models/instanceConfig.model';

interface IFeatureGroup {
  groupTags: string[];
  groupNode: Element;
  groupFeatureNodes: NodeListOf<Element>;
  groupFeatureNameNodes: Array<{ name: string; domIndex: number }>;
}

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit, AfterViewInit {
  @ViewChild('featureContainer', { static: true }) featureContainer: ElementRef<HTMLElement>;
  searchDirector = this.configSvc.instanceConfig.externalLinks.searchValue || 'search';
  ROLES = EUserRoles;
  queryControl = new FormControl(this.activatedRoute.snapshot.queryParams.query || '');
  private featureGroups: IFeatureGroup[] = [];

  isFeatureAvailable = this.configSvc.instanceConfig.features;

  links = this.configSvc.instanceConfig.externalLinks;
  isMobileAppAvailable = this.links.appsAndroid || this.links.appsAndroidMirror || this.links.appsIos;
  hasSomeGroup = true;
  featureAvailableStatus = new Set(
    Object.entries(this.configSvc.instanceConfig.features).map(([k, v]) => (v.available ? k : null))
  );

  contributionFeatureGroupHiddenStatus = true;
  adminFeatureGroupHiddenStatus = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public routingSvc: RoutingService,
    private authSvc: AuthService,
    public mobileAppsSvc: MobileAppsService,
    private util: UtilityService,
    private configSvc: ConfigService,
    private userSvc: UserService
  ) {}

  ngOnInit() {
    this.queryControl.valueChanges
      .pipe(
        startWith(this.queryControl.value),
        debounceTime(500)
      )
      .subscribe(query => {
        this.highlightMatching(query.trim().toLocaleLowerCase());
      });
    this.updateFlags();
  }

  highlightMatching(query: string) {
    query = query.trim().toLocaleLowerCase();
    this.hasSomeGroup = false;
    this.featureGroups.forEach(featureGroup => {
      if (featureGroup.groupTags.some(tag => tag.startsWith(query))) {
        // don't hide entire group
        this.hasSomeGroup = true;
        featureGroup.groupNode.classList.remove('hidden');
        // test for features inside this group
        const uniqueFeatureIndexes = new Set(
          featureGroup.groupFeatureNameNodes.filter(unit => query && unit.name.startsWith(query)).map(u => u.domIndex)
        );
        featureGroup.groupFeatureNodes.forEach((node, index) => {
          node.classList.remove('hidden');
          if (query !== '' && !uniqueFeatureIndexes.has(index)) {
            node.classList.add('hidden');
          }
        });
      } else {
        featureGroup.groupNode.classList.add('hidden');
      }
    });
  }
  ngAfterViewInit() {
    if (!this.featureContainer.nativeElement) {
      return;
    }
    this.featureGroups.length = 0;
    const featureGroups = this.featureContainer.nativeElement.querySelectorAll('.feature-group');

    featureGroups.forEach(group => {
      const featureGroup: IFeatureGroup = {
        groupNode: group,
        groupFeatureNodes: group.querySelectorAll('.feature'),
        groupTags: [],
        groupFeatureNameNodes: []
      };
      featureGroup.groupFeatureNodes.forEach((node: Element, domIndex: number) => {
        const allFeatureNames = (node.getAttribute('feature-name') || '')
          .split(/\s|;/)
          .map(s => s.trim().toLocaleLowerCase())
          .filter(s => s.length);
        featureGroup.groupTags.push(...allFeatureNames);
        featureGroup.groupFeatureNameNodes.push(
          ...allFeatureNames.map(name => ({
            name,
            domIndex
          }))
        );
      });
      this.featureGroups.push(featureGroup);
    });
  }

  confirmLogout() {
    this.authSvc.logout();
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(url);
  }

  openFeatureUnavailableDialog(type?: string) {
    this.util.featureUnavailable(type ? type : 'DEFAULT');
  }

  checkIfIntranet(externalUrlObj: IExternalUrl) {
    if (externalUrlObj.isIntranetOnly) {
      this.util.featureIntranetDialog(externalUrlObj.url);
    } else {
      window.open(externalUrlObj.url);
    }
  }

  updateFlags() {
    this.contributionFeatureGroupHiddenStatus =
      this.mobileAppsSvc.isMobile ||
      ((!this.configSvc.instanceConfig.externalLinks.authoringHome.url ||
        !this.userSvc.userRoles.has(this.ROLES.AUTHOR)) &&
        (!this.configSvc.instanceConfig.features.practiceAuthoring.enabled ||
          !this.userSvc.userRoles.has(this.ROLES.IAP)) &&
        (!this.links.authoringPublish.url || !this.userSvc.userRoles.has(this.ROLES.REVIEWER)) &&
        (!this.links.authoringReview.url || !this.userSvc.userRoles.has(this.ROLES.REVIEWER)) &&
        (!this.links.authoringCurate.url || !this.userSvc.userRoles.has(this.ROLES.AUTHOR)));

    this.adminFeatureGroupHiddenStatus = !this.userSvc.userRoles.has(this.ROLES.INFTQ_CERTIFICATION_ADMIN);
  }
}
