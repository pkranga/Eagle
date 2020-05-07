/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3"*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { IInstanceConfig } from '../models/instanceConfig.model';
import { IPreLoginConfig } from '../models/preLogin.model';

const apiEndpoints = {
  preLogin: '/public-assets/configs/pre-login'
};
const FILE_NAME_STORAGE_KEY = 'instance-config-json-file';
const storage: Storage = sessionStorage;
const fileName = location.host.startsWith('localhost') ? environment.defaultPreLoginConfig : location.host;
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  preLoginConfig: IPreLoginConfig = null;
  instanceConfig: IInstanceConfig = null;

  private currentInstanceFile: string;
  constructor(private http: HttpClient) {}

  async updatePreLoginConfig(forced?: boolean): Promise<IPreLoginConfig> {
    try {
      if (!forced && this.preLoginConfig) {
        return Promise.resolve(this.preLoginConfig);
      }
      this.preLoginConfig = await this.http
        .get<IPreLoginConfig>(apiEndpoints.preLogin + '/' + fileName + '.json')
        .toPromise();
      return this.preLoginConfig;
    } catch (error) {}
  }

  async updateInstanceConfig(fileName?: string, forced?: boolean): Promise<any> {
    try {
      const fileToDownload = fileName || this.selectedConfigFile || this.preLoginConfig.instanceConfigFile;
      if (!forced && this.currentInstanceFile === fileToDownload && this.instanceConfig) {
        return Promise.resolve(this.instanceConfig);
      }
      this.instanceConfig = await this.http.get<IInstanceConfig>(fileToDownload).toPromise();
      this.currentInstanceFile = fileToDownload;
      return this.instanceConfig;
    } catch (error) {}
  }

  simulateInstance(file: string) {
    this.updateInstanceConfig(fileName);
    storage.setItem(FILE_NAME_STORAGE_KEY, file);
    location.reload();
  }

  get selectedConfigFile() {
    return storage.getItem(FILE_NAME_STORAGE_KEY);
  }
  resetInstanceConfig() {
    storage.removeItem(FILE_NAME_STORAGE_KEY);
    location.reload();
  }
}
