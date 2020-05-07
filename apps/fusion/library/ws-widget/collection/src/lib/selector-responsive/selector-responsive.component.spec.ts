/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SelectorResponsiveComponent } from './selector-responsive.component'

describe('SelectorResponsiveComponent', () => {
  let component: SelectorResponsiveComponent
  let fixture: ComponentFixture<SelectorResponsiveComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectorResponsiveComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorResponsiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
