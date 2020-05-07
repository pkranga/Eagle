/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { IFeatureEventsConfigUnit } from '../models/instanceConfig.model';
import { ConfigService } from '../services/config.service';

@Injectable()
export class EventDetailResolve implements Resolve<IFeatureEventsConfigUnit> {
  constructor(private configSvc: ConfigService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IFeatureEventsConfigUnit {
    const eventId = route.paramMap.get('eventId');
    return this.configSvc.instanceConfig.features.events.config[eventId];
  }
}
