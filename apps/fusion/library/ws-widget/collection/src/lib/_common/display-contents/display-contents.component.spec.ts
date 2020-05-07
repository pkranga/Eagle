/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DisplayContentsComponent } from './display-contents.component'

describe('DisplayContentsComponent', () => {
  let component: DisplayContentsComponent
  let fixture: ComponentFixture<DisplayContentsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayContentsComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayContentsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
