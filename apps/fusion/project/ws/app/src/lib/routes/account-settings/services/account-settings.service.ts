/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NsAccountSettings } from '../models/account-settings.model'
import { Observable } from 'rxjs'
import { ApiService } from '@ws/author/src/lib/modules/shared/services/api.service'
import { NSApiResponse } from '@ws/author/src/lib/interface//apiResponse'
import { NsMiniProfile } from '../../../../../../../../library/ws-widget/collection/src/public-api'

const API_END_POINTS = {
  accountsettings: `/apis/protected/v8/user/account-settings`,
  updateEmailId: `/apis/protected/v8/user/change-email`,
  userMiniProfile: (wid: string) => `apis/protected/v8/user/mini-profile/${wid}`,
  resetPassword: `/apis/protected/v8/user/account-settings/resetPassword`,
}

@Injectable({
  providedIn: 'root',
})
export class AccountSettingsService {

  constructor(private http: HttpClient, private apiService: ApiService) { }

  accountSettings(accountsettingsObj: any): Observable<NsMiniProfile.IMiniProfileData> {
    return this.http.post<NsMiniProfile.IMiniProfileData>(API_END_POINTS.accountsettings, accountsettingsObj)
  }
  updateEmailId(data: NsAccountSettings.IUserMetaTypeData): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.updateEmailId}/email`, data)
  }

  upload(
    data: FormData,
    userId: string,
  ): Observable<NSApiResponse.IFileApiResponse> {
    const file = data.get('content') as File
    let fileName = file.name
    fileName = this.appendToFilename(fileName)
    const newFormData = new FormData()
    newFormData.append('content', file, fileName)
    return this.apiService.post<NSApiResponse.IFileApiResponse>(
path
      newFormData,
      false,
    )
  }
  publish(

    userId: string,
  ): Observable<NSApiResponse.IFileApiResponse> {
    return this.apiService.post<NSApiResponse.IFileApiResponse>(
path
      undefined, false,

    )
  }

  appendToFilename(filename: string) {
    const timeStamp = new Date().getTime()
    const dotIndex = filename.lastIndexOf('.')
    if (dotIndex === -1) {
      return filename + timeStamp
    }
    return filename.substring(0, dotIndex) + timeStamp + filename.substring(dotIndex)
  }

  getToken(): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.resetPassword}`, {})
  }

}
