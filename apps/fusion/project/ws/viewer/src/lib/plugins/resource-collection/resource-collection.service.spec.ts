/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { TestBed } from '@angular/core/testing'

import { ResourceCollectionService } from './resource-collection.service'

describe('ResourceCollectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: ResourceCollectionService = TestBed.get(ResourceCollectionService)
    expect(service).toBeTruthy()
  })
})
