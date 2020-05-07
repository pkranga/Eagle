/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InteractiveExerciseComponent } from './interactive-exercise.component'

describe('InteractiveExerciseComponent', () => {
  let component: InteractiveExerciseComponent
  let fixture: ComponentFixture<InteractiveExerciseComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InteractiveExerciseComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractiveExerciseComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
