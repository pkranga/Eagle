/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, OnDestroy, Input } from '@angular/core'
import { KnowledgeHubService } from '../../services/knowledge-hub.service'
import { Subscription } from 'rxjs'
import { IKhubItemTile, ISearchObjForView, IKhubProject } from '../../models/knowledgeHub.model'
import { ActivatedRoute } from '@angular/router'
// import { WsSharedValuesService } from '@ws-shared/services/src/public-api'
// import { map } from 'rxjs/operators'
import { ConfigurationsService, NsPage, ValueService, UtilityService } from '@ws-widget/utils'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { NsError, ROOT_WIDGET_CONFIG, NsContent } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-infy-khub-view',
  templateUrl: './khub-view.component.html',
  styleUrls: ['./khub-view.component.scss'],
})
export class KhubViewComponent implements OnInit, OnDestroy {
  @Input()
  content: NsContent.IContent | null = null
  defaultSideNavBarOpenedSubscription: Subscription | null = null
  isLtMedium$ = this.valueSvc.isLtMedium$
  screenSizeIsLtMedium = false
  sideNavBarOpened = true
  searchResultsSubscription: Subscription | undefined
  routeSubscription: Subscription | undefined
  viewData: IKhubItemTile = {} as IKhubItemTile
  moreRecs: IKhubItemTile[] = []
  projectResult: IKhubProject = {} as IKhubProject
  sObject: ISearchObjForView = {} as ISearchObjForView
  error = {
    load: false,
    message: '',
  }
  errorRecsys = false
  loader = true
  hasInternetUrl = false
  recsStatus = false
  pageNavbar: Partial<NsPage.INavBackground> = this.configSvc.pageNavBar
  errorWidget: NsWidgetResolver.IRenderConfigWithTypedData<NsError.IWidgetErrorResolver> = {
    widgetType: ROOT_WIDGET_CONFIG.errorResolver._type,
    widgetSubType: ROOT_WIDGET_CONFIG.errorResolver.errorResolver,
    widgetData: {
      errorType: 'internalServer',
    },
  }
  discussionForumData!: { description: string, identifier: string, name: string, title: string }
  constructor(
    private activated: ActivatedRoute,
    private khubSrv: KnowledgeHubService,
    private configSvc: ConfigurationsService,
    private valueSvc: ValueService,
    private utilitySvc: UtilityService,
  ) { }

  isDownloadableDesktop = false
  isDownloadableMobile = false

  ngOnInit() {
    this.defaultSideNavBarOpenedSubscription = this.isLtMedium$.subscribe((isLtMedium: boolean) => {
      this.screenSizeIsLtMedium = isLtMedium
      if (isLtMedium) {
        this.sideNavBarOpened = !isLtMedium
      } else {
        this.sideNavBarOpened = true
      }
    })
    this.routeSubscription = this.activated.params.subscribe(params => {
      this.sObject.category = params.category.toLowerCase()
      this.sObject.itemId = params.itemId.toLowerCase()
      this.sObject.source = params.source.toLowerCase()
      this.getViewData()
    })
    if (this.configSvc.restrictedFeatures) {
      this.isDownloadableMobile = this.configSvc.restrictedFeatures.has('mobileDownloadRequest')
      this.isDownloadableDesktop = this.configSvc.restrictedFeatures.has('downloadRequest')
    }
  }
  ngOnDestroy() {
    if (this.searchResultsSubscription) {
      this.searchResultsSubscription.unsubscribe()
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe()
    }
    if (this.defaultSideNavBarOpenedSubscription) {
      this.defaultSideNavBarOpenedSubscription.unsubscribe()
    }
  }

  getViewData() {
    try {
      this.searchResultsSubscription = this.khubSrv.fetchViewData(this.sObject).subscribe(
        data => {
          if (this.sObject.category === 'project') {
            this.viewData = this.khubSrv.setTileProject(data.project)[0]
            this.projectResult = data.project[0]
          } else if (this.sObject.category === 'document') {
            this.viewData = this.khubSrv.setTilesDocs(data.kshop)[0]
          } else {
            this.viewData = this.khubSrv.setTilesDocs(data.automationcentral)[0]
          }
          this.loader = false
          this.discussionForumData = {
            title: this.viewData.title || '',
            identifier: this.viewData.itemId ? this.viewData.itemId.toString() : '',
            description: this.viewData.description || '',
            name: this.viewData.title || '',
          }
          // console.log(this.viewData, this.projectResult)
          this.getMoreLikeThis()
        },
        error => {
          this.error.load = true
          this.loader = false
          this.error.message = error
        },
      )
    } catch (e) {
      throw e
    }
  }

  getMoreLikeThis() {
    try {
      this.searchResultsSubscription = this.khubSrv.fetchMoreLikeThis(this.sObject).subscribe(
        data => {
          if (this.sObject.category === 'project') {
            this.moreRecs = this.khubSrv.setTileProject(data.hits)
          } else if (this.sObject.category === 'document') {
            this.moreRecs = this.khubSrv.setTilesDocs(data.hits)
          } else {
            this.moreRecs = this.khubSrv.setTilesDocs(data.hits)
          }
          this.recsStatus = true
        },
        () => {
          this.errorRecsys = true
          this.recsStatus = true
        },
      )
    } catch (e) {
      throw e
    }
  }

  get isDownloadable() {
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.isDownloadableSource
      && this.content && this.content.sourceName) {
      if (this.utilitySvc.isMobile && !this.isDownloadableMobile) {
        return true
      }
      if (!this.utilitySvc.isMobile && !this.isDownloadableDesktop) {
        return true
      } return false
    } return false
  }

  download() {
    if (this.content) {
      const link = document.createElement('a')
      link.download = this.content.name
      link.target = '_self'

      // Construct the URI
      link.href = this.content.artifactUrl || ''
      document.body.appendChild(link)
      link.click()

      // Cleanup the DOM
      document.body.removeChild(link)
    }

    // delete link;
  }
}
