/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DiscussionPostComponent } from './discussion-post.component'

describe('DiscussionPostComponent', () => {
  let component: DiscussionPostComponent
  let fixture: ComponentFixture<DiscussionPostComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscussionPostComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscussionPostComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
