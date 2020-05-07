/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { Injectable } from '@angular/core'
import { TourService } from 'ngx-tour-md-menu'

@Injectable({
  providedIn: 'root',
})

export class CustomTourService {

  public data: any = {}
  constructor(private tourSvc: TourService) { }

  public startTour() {
    this.tourSvc.initialize(this.data.filter(
      (v: { anchorId: string }) => (document.querySelectorAll(`[touranchor="${v.anchorId}"]`).length) > 0,
    ))
    this.tourSvc.start()
  }
}
