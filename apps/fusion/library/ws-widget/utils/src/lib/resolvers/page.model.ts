/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { NsWidgetResolver } from '@ws-widget/resolver'
import { NsAppsConfig } from '../services/configurations.model'
import { ThemePalette } from '@angular/material'

export namespace NsPage {
  export interface IPage {
    contentType: string
    navigationBar: INavBar
    pageLayout: NsWidgetResolver.IRenderConfigWithAnyData
  }

  export interface INavBar {
    links: NsWidgetResolver.IRenderConfigWithTypedData<INavLink>[]
    xsmallNonMenuLinks: NsWidgetResolver.IRenderConfigWithTypedData<INavLink>[]
    pageBackLink: string
    pageTitle: string
    background: INavBackground
  }
  export interface INavBackground {
    color: 'primary' | 'accent' | 'warn' | 'default'
    styles: { [id: string]: string }
  }

  export interface INavLink {
    config: Pick<INavLinkConfig<'card-full' | 'card-small'>, 'type' | 'hideStatus'> |
    Pick<INavLinkConfig<'mat-icon-button' | 'mat-fab' | 'mat-mini-fab' | 'card-mini'>, 'type'> |
    Pick<INavLinkConfig<'mat-button' | 'mat-raised-button' | 'mat-flat-button' | 'mat-stroked-button'>, 'type' | 'hideIcon' | 'hideTitle'> |
    Pick<INavLinkConfig<'mat-menu-item'>, 'type'> |
    Pick<INavLinkConfig<'feature-item'>, 'type' | 'useShortName' | 'iconColor' | 'treatAsCard' | 'hidePin'>
    actionBtnId?: string
    actionBtn?: NsAppsConfig.IFeature
  }

  export interface INavLinkConfig<T> {
    type: T
    hideIcon?: boolean
    hideTitle?: boolean
    hideStatus?: boolean
    hidePin?: boolean
    iconColor?: ThemePalette
    treatAsCard?: boolean
    useShortName?: boolean
  }

}
