/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
// model imports
import { IContent } from '../models/content.model';
// service imports
import { PlayerDataService } from '../services/player-data.service';
import { IProcessedViewerContent } from '../services/viewer.service';

export interface IPluginResolve {
  data: string;
  toc: IContent;
  content: IContent;
  error?: string;
  processedContent: IProcessedViewerContent;
  collectionId: string;
}

@Injectable()
export class PluginResolve implements Resolve<IPluginResolve> {
  constructor(private playerDataSvc: PlayerDataService) {}
  async resolve(): Promise<IPluginResolve> {
    return this.playerDataSvc.data;
  }
}
