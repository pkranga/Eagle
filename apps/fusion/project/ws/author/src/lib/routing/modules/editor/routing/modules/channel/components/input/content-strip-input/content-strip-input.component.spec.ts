/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ContentStripInputComponent } from './content-strip-input.component'

describe('ContentStripInputComponent', () => {
  let component: ContentStripInputComponent
  let fixture: ComponentFixture<ContentStripInputComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentStripInputComponent],
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentStripInputComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
