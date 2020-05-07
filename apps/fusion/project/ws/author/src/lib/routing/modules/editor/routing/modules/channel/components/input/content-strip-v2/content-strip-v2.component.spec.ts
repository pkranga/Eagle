/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ContentStripV2Component } from './content-strip-v2.component'

describe('ContentStripV2Component', () => {
  let component: ContentStripV2Component
  let fixture: ComponentFixture<ContentStripV2Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripV2Component],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripV2Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
