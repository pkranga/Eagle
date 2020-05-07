/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { DialogSocialActivityUserComponent } from './dialog-social-activity-user.component'

describe('DialogSocialActivityUserComponent', () => {
  let component: DialogSocialActivityUserComponent
  let fixture: ComponentFixture<DialogSocialActivityUserComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogSocialActivityUserComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSocialActivityUserComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
