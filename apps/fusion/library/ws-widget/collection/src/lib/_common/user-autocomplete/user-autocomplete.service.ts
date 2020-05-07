/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { NsAutoComplete } from './user-autocomplete.model'
import { Observable } from 'rxjs'

// TODO: move this in some common place
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  AUTOCOMPLETE: (query: string) => `${PROTECTED_SLAG_V8}/user/autocomplete/${query}`,
}

@Injectable({
  providedIn: 'root',
})
export class UserAutocompleteService {

  constructor(
    private http: HttpClient,
  ) { }

  fetchAutoComplete(
    query: string,
  ): Observable<NsAutoComplete.IUserAutoComplete[]> {
    return this.http.get<NsAutoComplete.IUserAutoComplete[]>(
      API_END_POINTS.AUTOCOMPLETE(query),
    )
  }
}
