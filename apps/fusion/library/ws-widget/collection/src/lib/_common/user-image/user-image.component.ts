/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input, OnChanges } from '@angular/core'
import { ConfigurationsService } from '@ws-widget/utils'
import { UserMiniProfileService } from '../../mini-profile/user-mini-profile.service'
import { NsMiniProfile } from '../../mini-profile/mini-profile.model'

@Component({
  selector: 'ws-widget-user-image',
  templateUrl: './user-image.component.html',
  styleUrls: ['./user-image.component.scss'],
})
export class UserImageComponent implements OnInit, OnChanges {

  @Input() email = ''
  @Input() userId: string | null = null
  @Input() userName = ''
  @Input() imageType: 'initial' | 'rounded' | 'name-initial' = 'initial'
  basePicUrl = `/apis/protected/v8/user/profile/graph/photo/`
  errorOccurred = false
  verifiedMicrosoftEmail = ''
  shortName = ''
  imageUrl: string | null = null
  constructor(
    private configSvc: ConfigurationsService,
    private miniProfileSvc: UserMiniProfileService,
  ) { }

  ngOnInit() { }

  ngOnChanges() {
    if (
      this.email &&
      this.configSvc.instanceConfig &&
      this.configSvc.instanceConfig.microsoft &&
      this.configSvc.instanceConfig.microsoft.validEmailExtensions
    ) {
      if (this.configSvc.instanceConfig.microsoft.validEmailExtensions.some(extension => this.email.includes(extension))) {
        this.verifiedMicrosoftEmail = this.email
      }
    } else {
path
        this.imageUrl = null
        this.miniProfileSvc.viewMiniProfile(this.userId).subscribe(
          (response: NsMiniProfile.IMiniProfileData) => {
            this.imageUrl = response.profile_image ? response.profile_image : null
          },
        )
      }
    }
    if (this.userName) {
      const userNameArr = this.userName.split(' ').slice(0, 2)
      this.shortName = userNameArr.map(u => u[0]).join('').toUpperCase()
    } else {
      this.shortName = ((this.email && this.email[0]) || '').toUpperCase()
    }
  }

}
