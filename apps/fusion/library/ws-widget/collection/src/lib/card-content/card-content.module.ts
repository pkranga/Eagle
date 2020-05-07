/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { MatCardModule, MatIconModule, MatButtonModule, MatTooltipModule, MatMenuModule, MatChipsModule } from '@angular/material'
import { PipeDurationTransformModule, DefaultThumbnailModule, PipePartialContentModule, PipeHtmlTagRemovalModule } from '@ws-widget/utils'
import { DisplayContentTypeModule } from '../_common/display-content-type/display-content-type.module'
import { ContentProgressModule } from '../_common/content-progress/content-progress.module'

import { BtnContentDownloadModule } from '../btn-content-download/btn-content-download.module'
import { BtnContentLikeModule } from '../btn-content-like/btn-content-like.module'
import { BtnContentShareModule } from '../btn-content-share/btn-content-share.module'
import { BtnGoalsModule } from '../btn-goals/btn-goals.module'
import { BtnPlaylistModule } from '../btn-playlist/btn-playlist.module'
import { BtnContentMailMeModule } from '../btn-content-mail-me/btn-content-mail-me.module'

import { CardContentComponent } from './card-content.component'
import { BtnKbModule } from '../btn-kb/btn-kb.module'
import { PipeContentRouteModule } from '../_common/pipe-content-route/pipe-content-route.module'
import { BtnFollowModule } from '../btn-follow/btn-follow.module'
import { UserImageModule } from '../_common/user-image/user-image.module'
import { BtnChannelAnalyticsModule } from '../btn-channel-analytics/btn-channel-analytics.module'
import { MiniProfileModule } from '../mini-profile/mini-profile.module'
import { ProfileImageModule } from '../_common/profile-image/profile-image.module'

@NgModule({
  declarations: [CardContentComponent],
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    MatChipsModule,
    DefaultThumbnailModule,
    DisplayContentTypeModule,
    PipeDurationTransformModule,
    PipePartialContentModule,
    PipeContentRouteModule,
    PipeHtmlTagRemovalModule,
    ContentProgressModule,
    BtnKbModule,
    BtnContentDownloadModule,
    BtnContentLikeModule,
    BtnContentShareModule,
    BtnGoalsModule,
    BtnPlaylistModule,
    BtnContentMailMeModule,
    BtnFollowModule,
    UserImageModule,
    BtnChannelAnalyticsModule,
    MiniProfileModule,
    ProfileImageModule,
  ],
  entryComponents: [CardContentComponent],
  exports: [CardContentComponent],
})
export class CardContentModule { }
