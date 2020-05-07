/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { NsContent } from '../../_services/widget-content.model'
import { ConfigurationsService, UtilityService } from '../../../../../utils/src/public-api'
import { Router } from '@angular/router'

@Component({
  selector: 'ws-widget-player-brief',
  templateUrl: './player-brief.component.html',
  styleUrls: ['./player-brief.component.scss'],
})
export class PlayerBriefComponent implements OnInit {

  @Input()
  content: NsContent.IContent | null = null
  @Input()
  hasTocStructure = false
  @Input()
  tocStructure: any = null
  @Input()
  isPreviewMode = false

  contentTypes = NsContent.EContentTypes
  showMoreGlance = false
  constructor(
    private configSvc: ConfigurationsService,
    private utilitySvc: UtilityService,
    private router: Router,
  ) { }
  isDownloadableDesktop = false
  isDownloadableIos = false
  isDownloadableAndroid = false

  ngOnInit() {
    if (this.configSvc.restrictedFeatures) {
      this.isDownloadableIos = this.configSvc.restrictedFeatures.has('iosDownload')
      this.isDownloadableAndroid = this.configSvc.restrictedFeatures.has('androidDownload')
      this.isDownloadableDesktop = this.configSvc.restrictedFeatures.has('downloadRequest')
    }
  }

  get isDownloadable() {
    if (this.configSvc.instanceConfig && this.configSvc.instanceConfig.isDownloadableSource
      && this.configSvc.instanceConfig.isDownloadableAndroidResource
      && this.content && this.content.sourceName && this.configSvc.instanceConfig.isDownloadableIosResource
      && Object.keys(this.configSvc.instanceConfig.isDownloadableSource).includes(this.content.sourceName.toLowerCase())) {
      const sourceShortName: string = this.content.sourceName || ''
      // tslint:disable-next-line:max-line-length
      if (!this.utilitySvc.isMobile && !this.isDownloadableDesktop && this.configSvc.instanceConfig.isDownloadableSource[sourceShortName.toLowerCase()].includes(this.content.resourceType.toLowerCase())) {
        return true
      }
      if (this.utilitySvc.isIos && !this.isDownloadableIos
        // tslint:disable-next-line:max-line-length
        && this.configSvc.instanceConfig.isDownloadableIosResource[sourceShortName.toLowerCase()].includes(this.content.resourceType.toLowerCase())) {
        return true
      }
      if (this.utilitySvc.isAndroid && !this.isDownloadableAndroid
        // tslint:disable-next-line:max-line-length
        && this.configSvc.instanceConfig.isDownloadableAndroidResource[sourceShortName.toLowerCase()].includes(this.content.resourceType.toLowerCase())) {
        return true
      }
      return false
    } return false
  }

  goToContent(id: string) {
    this.router.navigate([`/app/toc/${id}/overview`])
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
