/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InfluenceChangeComponent } from './influence-change.component'

describe('InfluenceChangeComponent', () => {
  let component: InfluenceChangeComponent
  let fixture: ComponentFixture<InfluenceChangeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfluenceChangeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InfluenceChangeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
