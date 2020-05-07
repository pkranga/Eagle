/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { ErrorHandler, Injectable } from '@angular/core'
import { LoggerService } from '../../../../../../library/ws-widget/utils/src/public-api'
import { LoaderService } from './loader.service'

@Injectable()
export class AuthoringErrorHandler implements ErrorHandler {

  constructor(
    private loaderService: LoaderService,
    private loggerService: LoggerService,
  ) { }

  handleError(error: any) {
    this.loaderService.changeLoad.next(false)
    this.loggerService.error(error)
  }
}
