/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { YoutubeComponent } from './youtube.component'

describe('YoutubeComponent', () => {
  let component: YoutubeComponent
  let fixture: ComponentFixture<YoutubeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YoutubeComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
