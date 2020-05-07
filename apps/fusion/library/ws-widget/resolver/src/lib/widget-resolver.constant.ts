/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { InjectionToken } from '@angular/core'
import { NsWidgetResolver as resolver } from './widget-resolver.model'

export const WIDGET_RESOLVER_GLOBAL_CONFIG = new InjectionToken<resolver.IRegistrationConfig[]>(
  'Global Registration Configuration for Widget Resolvers',
)

export const WIDGET_RESOLVER_SCOPED_CONFIG = new InjectionToken<resolver.IRegistrationConfig[]>(
  'Scoped Registration Configuration for Widget Resolvers',
)
