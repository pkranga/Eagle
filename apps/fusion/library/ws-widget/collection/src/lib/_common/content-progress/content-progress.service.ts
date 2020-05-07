/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { ReplaySubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http'

// TODO: move this in some common place
const PROTECTED_SLAG_V8 = '/apis/protected/v8'
const API_END_POINTS = {
  PROGRESS_HASH: `${PROTECTED_SLAG_V8}/user/progress`,
}

@Injectable({
  providedIn: 'root',
})
export class ContentProgressService {

  private progressHashSubject: ReplaySubject<{ [id: string]: number }> = new ReplaySubject(1)
  private progressHash: { [id: string]: number } | null = null
  private isFetchingProgress = false

  constructor(
    private http: HttpClient,
  ) { }

  getProgressFor(id: string): Observable<number> {
    if (this.shouldFetchProgress) {
      this.fetchProgressHash()
    }
    return this.progressHashSubject.pipe(map(hash => hash[id]))
  }

  getProgressHash(): Observable<{ [id: string]: number }> {
    if (this.shouldFetchProgress) {
      this.fetchProgressHash()
    }
    return this.progressHashSubject
  }
  private fetchProgressHash() {
    this.isFetchingProgress = true
    this.http.get<{ [id: string]: number }>(API_END_POINTS.PROGRESS_HASH).subscribe(data => {
      this.progressHash = data
      this.isFetchingProgress = false
      this.progressHashSubject.next(data)
    })
  }
  private get shouldFetchProgress(): boolean {
    return Boolean(this.progressHash === null && !this.isFetchingProgress)
  }
}
