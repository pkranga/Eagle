/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InvalidPermissionComponent } from './invalid-permission.component'

describe('InvalidPermissionComponent', () => {
  let component: InvalidPermissionComponent
  let fixture: ComponentFixture<InvalidPermissionComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InvalidPermissionComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InvalidPermissionComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
