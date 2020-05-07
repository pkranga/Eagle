/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router'
import { IIndustries, ISubPillar, IPillarSection } from '../../models/account.model'
import { MatTabChangeEvent } from '@angular/material'
import { NsWidgetResolver } from '@ws-widget/resolver'
import { ILpData } from '../../models/navigator.model'
import { NsContentStripMultiple, NsError, ROOT_WIDGET_CONFIG } from '@ws-widget/collection'

@Component({
  selector: 'ws-app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  tabs: string[] = []
  fetchingContentData = false
  contentStripsHash = {}
  accountsData: IIndustries = {}
  accountsActive = false
  contentStrips = [
    {
      id: 'overview',
      title: 'Overview',
    },
    {
      id: 'gtm',
      title: 'Case Study',
    },
    {
      id: 'tech',
      title: 'Technology',
    },
  ]
  selectedTab: string
  selectedAccount: string
  selectedPortfolio: string
  selectedPillar = 'Experience'
  selectedTheme: string
  noData = false

  baseAccountsUrl = '/app/infy/navigator/accounts/'

  overviewWidgetResolverData: NsWidgetResolver.IRenderConfigWithTypedData<
    NsContentStripMultiple.IContentStripMultiple
  > = {
    widgetType: 'contentStrip',
    widgetSubType: 'contentStripMultiple',
    widgetData: {
      strips: [
        {
          key: 'overview-strip',
          preWidgets: [],
          title: 'Overview',
          filters: [],
          request: {
            ids: [],
          },
        },
      ],
    },
  }

  errorWidget: NsWidgetResolver.IRenderConfigWithTypedData<NsError.IWidgetErrorResolver> = {
    widgetType: ROOT_WIDGET_CONFIG.errorResolver._type,
    widgetSubType: ROOT_WIDGET_CONFIG.errorResolver.errorResolver,
    widgetData: {
      errorType: 'contentUnavailable',
    },
  }

  gtmWidgetResolverData: NsWidgetResolver.IRenderConfigWithTypedData<
    NsContentStripMultiple.IContentStripMultiple
  > = {
    widgetType: 'contentStrip',
    widgetSubType: 'contentStripMultiple',
    widgetData: {
      strips: [
        {
          key: 'gtm-strip',
          preWidgets: [],
          title: 'Contents',
          filters: [],
          request: {
            ids: [],
          },
        },
      ],
      errorWidget: this.errorWidget,
    },
  }

  techwidgetResolverData: NsWidgetResolver.IRenderConfigWithTypedData<
    NsContentStripMultiple.IContentStripMultiple
  > = {
    widgetType: 'contentStrip',
    widgetSubType: 'contentStripMultiple',
    widgetData: {
      strips: [
        {
          key: 'tech-strip',
          preWidgets: [],
          title: 'Tech Skills',
          filters: [],
          request: {
            ids: [],
          },
        },
      ],
    },
  }

  routeSubscription: Subscription | null = null

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.selectedAccount = ''
    this.selectedPillar = ''
    this.selectedTheme = ''
    this.selectedPortfolio = ''
    this.selectedTab = ''
  }

  ngOnInit() {
    this.accountsData = this.route.snapshot.data.pageData.data

    this.tabs = Object.keys(this.accountsData).sort()
    // this.logger.log('accounts', this.accountsData)
    this.routeSubscription = this.route.params.subscribe(params => {
      if (params['tab']) {
        this.selectedTab = params.tab.toLowerCase() || 'communications'
        // this.logger.log('selected', this.selectedTab)
        const data = this.accountsData[this.selectedTab]
        // this.logger.log('data', data, Object.keys(data))
        if (Object.keys(data).length) {
          // this.logger.log('data exits', this.accountsData[this.selectedTab])
          this.noData = false
          this.updateData()
        } else {
          // this.logger.log('No data inside')
          this.noData = true
        }
      } else {
        this.selectedTab = 'communications'
        this.updateData()
      }
    })
  }

  updateData() {
    this.fetchingContentData = true
    // this.logger.log('tab', this.selectedTab)
    this.selectedAccount = this.fetchAccounts()[0]
    // this.logger.log('Check account', this.selectedAccount)
    this.selectedPortfolio = this.fetchPortfolios()[0]
    // this.logger.log('Check portfolio', this.selectedPortfolio)

    this.selectedTheme = this.fetchThemes()[0]
    // this.logger.log('Check theme', this.selectedTheme)

//     const pillars: ISubPillar = this.accountsData[this.selectedTab][this.selectedAccount][
// this.selectedPortfolio
// ][this.selectedPillar][this.selectedTheme]
    // this.logger.log('Check pillars', pillars)
    this.updateContentStrip()
  }

  getStripMeta(stripName: string) {
    return {
      ctitle: stripName,
    }
  }

  updateContentStrip() {
    const pillars: ISubPillar = this.accountsData[this.selectedTab][this.selectedAccount][
      this.selectedPortfolio
][this.selectedPillar][this.selectedTheme]

    const gtmIds: string[] = []
    const overViewIds: string[] = []
    const techIds: string[] = []

    pillars.gtm.forEach((pillarSection: IPillarSection) => {
      gtmIds.push(pillarSection.identifier)
    })

    pillars.overview.forEach((pillarSection: IPillarSection) => {
      overViewIds.push(pillarSection.identifier)
    })

    pillars.tech.forEach((pillarSection: IPillarSection) => {
      techIds.push(pillarSection.identifier)
    })

    this.overviewWidgetResolverData.widgetData.strips.forEach(strip => {
      if (strip.key === 'overview-strip' && strip.request) {
        strip.request.ids = overViewIds
      }
    })
    this.overviewWidgetResolverData = { ...this.overviewWidgetResolverData }
    this.gtmWidgetResolverData.widgetData.strips.forEach(strip => {
      if (strip.key === 'gtm-strip' && strip.request) {
        strip.request.ids = gtmIds
      }
    })
    // this.logger.log('gtm', this.gtmWidgetResolverData)

    this.gtmWidgetResolverData = { ...this.gtmWidgetResolverData }
    this.techwidgetResolverData.widgetData.strips.forEach(strip => {
      if (strip.key === 'tech-strip' && strip.request) {
        strip.request.ids = techIds
      }
    })
    // this.logger.log('tech', this.techwidgetResolverData)

    this.techwidgetResolverData = { ...this.techwidgetResolverData }
  }

  knowMoreClicked(lpItem: ILpData) {
    this.router.navigateByUrl(lpItem.lp_external_certification[0].lp_external_certification_link)
  }

  fetchAccounts() {
    try {
      return Object.keys(this.accountsData[this.selectedTab])
    } catch (e) {
      return []
    }
  }

  fetchPortfolios() {
    try {
      return Object.keys(this.accountsData[this.selectedTab][this.selectedAccount])
    } catch (e) {
      return []
    }
  }

  fetchThemes() {
    try {
      return Object.keys(
        this.accountsData[this.selectedTab][this.selectedAccount][this.selectedPortfolio][
          this.selectedPillar
],
      )
    } catch (e) {
      return []
    }
  }

  accountClicked(account: string) {
    this.selectedAccount = account
    this.selectedPortfolio = this.fetchPortfolios()[0]
    this.selectedTheme = this.fetchThemes()[0]
    if (!this.accountsData[this.selectedTab][this.selectedAccount].length) {
      // this.logger.log('empty')
      this.noData = true
    } else {
      // this.logger.log('Account', this.selectedAccount, this.selectedPortfolio, this.selectedTheme)
      this.updateContentStrip()
    }
  }

  portfolioClicked(portfolio: string) {
    this.selectedPortfolio = portfolio
    this.selectedTheme = this.fetchThemes()[0]
    this.updateContentStrip()
  }

  pillarClicked(pillar: string) {
    this.selectedPillar = pillar
    this.selectedTheme = this.fetchThemes()[0]
    this.updateContentStrip()
  }

  themeClicked(theme: string) {
    this.selectedTheme = theme
    this.updateContentStrip()
  }

  isObjectEmpty(obj: {}) {
    if (!obj) {
      return true
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false
      }
    }
    return true
  }

  getSelectedIndex() {
    return this.tabs.indexOf(this.selectedTab)
  }

  navigate(event: MatTabChangeEvent) {
    this.noData = false
    this.router.navigateByUrl(this.baseAccountsUrl + event.tab.textLabel)
  }

  caps(str: string) {
    return str.toLocaleUpperCase()
  }
}
