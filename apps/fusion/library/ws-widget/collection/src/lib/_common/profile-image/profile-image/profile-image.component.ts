/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Component, OnInit, Input } from '@angular/core'
import { UserMiniProfileService } from '../../../mini-profile/user-mini-profile.service'
import { NsMiniProfile } from '../../../mini-profile/mini-profile.model'

@Component({
  selector: 'ws-widget-profile-image',
  templateUrl: './profile-image.component.html',
  styleUrls: ['./profile-image.component.scss'],
})
export class ProfileImageComponent implements OnInit {

  @Input() userId = ''
  @Input() userName = ''
  shortName = ''
  imageUrl: string | null = null
  fetchingData = true
  constructor(private miniProfileSvc: UserMiniProfileService) { }

  ngOnInit() {

    if (this.userName) {
      const userNameArr = this.userName.split(' ').slice(0, 2)
      this.shortName = userNameArr.map(u => u[0]).join('').toUpperCase()
    } else {
      this.shortName = ''
    }
    if (this.userId) {
      this.miniProfileSvc.viewMiniProfile(this.userId).subscribe(
        (response: NsMiniProfile.IMiniProfileData) => {
          this.fetchingData = false
          this.imageUrl = response.profile_image ? response.profile_image : null
        },
        _ => {
          this.fetchingData = false
        },
      )
    }
  }

}
