/*               "Copyright 2020 Infosys Ltd.
               Use of this source code is governed by GPL v3 license that can be found in the LICENSE file or at https://opensource.org/licenses/GPL-3.0
               This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License version 3" */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LeaderboardComponent } from './leaderboard.component'

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent
  let fixture: ComponentFixture<LeaderboardComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LeaderboardComponent],
    })
    .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
