/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BtnContentMailMeComponent } from './btn-content-mail-me.component'

describe('BtnContentMailMeComponent', () => {
  let component: BtnContentMailMeComponent
  let fixture: ComponentFixture<BtnContentMailMeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BtnContentMailMeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BtnContentMailMeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
