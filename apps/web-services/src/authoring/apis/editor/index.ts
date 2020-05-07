/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
// tslint:disable-next-line: no-commented-code
import { NextFunction, Request, Response, Router } from 'express'

// tslint:disable-next-line: no-commented-code
export const editorApi = Router()

editorApi.use((_req: Request, _res: Response, next: NextFunction) => {
  next()
})

// editorApi.get('/getCompleteDetails/:id', (req: Request, res: Response) => {
//   const isAdmin: boolean = req.query.isAdmin
// })
